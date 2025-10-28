/**
 * Node Explorer Tools
 * Search and get information about n8n nodes
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { N8nDatabase } from '../database/db.js';
import type { SearchNodesInput, SearchNodesOutput } from '../types/index.js';

export function registerNodeExplorerTools(
  server: McpServer,
  db: N8nDatabase
): void {
  // ========== SEARCH NODES ==========

  server.registerTool(
    'search-nodes',
    {
      title: 'Search n8n Nodes',
      description: 'Search through 541 available n8n nodes by name, description, or functionality',
      inputSchema: {
        query: z.string().describe('Search query (e.g., "email", "google sheets", "slack")'),
        category: z.string().optional().describe('Filter by category'),
        aiOnly: z.boolean().optional().describe('Show only AI/LangChain nodes'),
        limit: z.number().optional().describe('Maximum results (default: 20)')
      },
      outputSchema: {
        nodes: z.array(z.object({
          name: z.string(),
          displayName: z.string(),
          description: z.string(),
          category: z.string(),
          isAiNode: z.boolean()
        })),
        total: z.number()
      }
    },
    async (input: SearchNodesInput) => {
      try {
        const nodes = db.searchNodes(input.query, {
          category: input.category,
          aiOnly: input.aiOnly,
          limit: input.limit || 20
        });

        const output: SearchNodesOutput = {
          nodes: nodes.map(node => ({
            name: node.name,
            displayName: node.displayName,
            description: node.description,
            category: node.category,
            isAiNode: node.isAiNode || false
          })),
          total: nodes.length
        };

        let message = `🔍 Found ${nodes.length} matching node(s):\n\n`;

        nodes.forEach((node, index) => {
          message += `${index + 1}. **${node.displayName}**\n`;
          message += `   Type: ${node.name}\n`;
          message += `   Category: ${node.category}\n`;
          if (node.isAiNode) {
            message += `   🤖 AI-Enabled\n`;
          }
          message += `   Description: ${node.description}\n\n`;
        });

        if (nodes.length === 0) {
          message = `No nodes found matching "${input.query}". Try a different search term.`;
        }

        return {
          content: [{
            type: 'text',
            text: message
          }],
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error searching nodes: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== GET NODE DOCUMENTATION ==========

  server.registerTool(
    'get-node-documentation',
    {
      title: 'Get Node Documentation',
      description: 'Get detailed documentation and usage examples for a specific n8n node',
      inputSchema: {
        nodeName: z.string().describe('Exact node name (e.g., "n8n-nodes-base.gmail")')
      },
      outputSchema: {
        success: z.boolean(),
        node: z.object({
          name: z.string(),
          displayName: z.string(),
          description: z.string(),
          category: z.string(),
          documentation: z.string().optional(),
          parameters: z.string(),
          examples: z.string().optional(),
          isAiNode: z.boolean()
        }).optional(),
        error: z.string().optional()
      }
    },
    async (input: { nodeName: string }) => {
      try {
        const node = db.getNodeByName(input.nodeName);

        if (!node) {
          return {
            content: [{
              type: 'text',
              text: `❌ Node "${input.nodeName}" not found in database. Use search-nodes to find available nodes.`
            }],
            isError: true
          } as any;
        }

        let message = `📚 Documentation for ${node.displayName}\n\n`;
        message += `**Type:** ${node.name}\n`;
        message += `**Category:** ${node.category}\n`;
        if (node.isAiNode) {
          message += `**AI-Enabled:** 🤖 Yes\n`;
        }
        message += `\n**Description:**\n${node.description}\n\n`;

        if (node.documentation) {
          message += `**Documentation:**\n${node.documentation}\n\n`;
        }

        // Parse and display parameters if available
        try {
          const params = JSON.parse(node.parameters);
          if (params && Object.keys(params).length > 0) {
            message += `**Parameters:**\n${JSON.stringify(params, null, 2)}\n\n`;
          }
        } catch (e) {
          // Parameters not parseable
        }

        // Display examples if available
        if (node.examples) {
          try {
            const examples = JSON.parse(node.examples);
            if (examples) {
              message += `**Examples:**\n${JSON.stringify(examples, null, 2)}\n`;
            }
          } catch (e) {
            // Examples not parseable
          }
        }

        return {
          content: [{
            type: 'text',
            text: message
          }]
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error getting node documentation: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== LIST NODE CATEGORIES ==========

  server.registerTool(
    'list-node-categories',
    {
      title: 'List Node Categories',
      description: 'Get a list of all node categories available in n8n',
      inputSchema: {},
      outputSchema: {
        categories: z.array(z.string()),
        total: z.number()
      }
    },
    async () => {
      try {
        const categories = db.getNodeCategories();

        let message = `📂 Available node categories (${categories.length}):\n\n`;
        categories.forEach((cat, index) => {
          message += `${index + 1}. ${cat}\n`;
        });

        return {
          content: [{
            type: 'text',
            text: message
          }]
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error listing categories: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );
}
