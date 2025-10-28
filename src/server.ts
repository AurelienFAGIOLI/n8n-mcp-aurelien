/**
 * n8n MCP Server
 * Main server implementation using Model Context Protocol
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { N8nDatabase } from './database/db.js';
import { N8nApiClient } from './n8n-api/client.js';
import { registerWorkflowTools } from './tools/workflow-manager.js';
import { registerWorkflowCreatorTool } from './tools/workflow-creator.js';
import { registerNodeExplorerTools } from './tools/node-explorer.js';
import { registerTemplateTools } from './tools/template-search.js';
import type { N8nMcpConfig } from './types/index.js';

export class N8nMcpServer {
  private mcpServer: McpServer;
  private db: N8nDatabase;
  private n8nClient: N8nApiClient;
  private config: N8nMcpConfig;

  constructor(config: N8nMcpConfig) {
    this.config = config;

    // Initialize MCP server
    this.mcpServer = new McpServer({
      name: 'n8n-mcp-aurelien',
      version: '1.0.0'
    });

    // Initialize database
    this.db = new N8nDatabase(config.databasePath);

    // Initialize n8n API client
    this.n8nClient = new N8nApiClient(config.n8nApiUrl, config.n8nApiKey);

    this.log('info', 'Server initialized');
  }

  /**
   * Register all MCP tools
   */
  async registerTools(): Promise<void> {
    this.log('info', 'Registering MCP tools...');

    try {
      // Register workflow management tools (CRUD)
      registerWorkflowTools(this.mcpServer, this.n8nClient);
      this.log('info', '✓ Workflow management tools registered');

      // Register workflow creator tool (AI-assisted creation)
      registerWorkflowCreatorTool(this.mcpServer, this.n8nClient, this.db);
      this.log('info', '✓ Workflow creator tool registered');

      // Register node explorer tools
      registerNodeExplorerTools(this.mcpServer, this.db);
      this.log('info', '✓ Node explorer tools registered');

      // Register template search tools
      registerTemplateTools(this.mcpServer, this.db);
      this.log('info', '✓ Template search tools registered');

      this.log('info', 'All tools registered successfully');
    } catch (error) {
      this.log('error', `Failed to register tools: ${error}`);
      throw error;
    }
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    this.log('info', 'Starting n8n MCP server...');

    // Test n8n API connection
    const connectionOk = await this.n8nClient.testConnection();
    if (!connectionOk) {
      throw new Error('Failed to connect to n8n API. Check your N8N_API_URL and N8N_API_KEY.');
    }
    this.log('info', '✓ n8n API connection successful');

    // Log database stats
    const stats = this.db.getStats();
    this.log('info', `Database stats: ${stats.totalNodes} nodes, ${stats.totalTemplates} templates, ${stats.aiNodes} AI nodes`);

    // Register all tools
    await this.registerTools();

    // Connect via stdio transport (for Claude Desktop)
    const transport = new StdioServerTransport();
    await this.mcpServer.connect(transport);

    this.log('info', '🚀 n8n MCP server running! Claude can now interact with n8n.');
  }

  /**
   * Logging utility
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex >= configLevelIndex) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      // Only output to stderr to avoid interfering with MCP stdio protocol
      if (this.config.mcpMode === 'stdio') {
        console.error(`${prefix} ${message}`);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Cleanup resources
   */
  async stop(): Promise<void> {
    this.log('info', 'Stopping server...');
    this.db.close();
  }
}
