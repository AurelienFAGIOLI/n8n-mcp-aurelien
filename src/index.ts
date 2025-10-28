#!/usr/bin/env node
/**
 * n8n MCP Server - Main Entry Point
 * Complete MCP implementation for n8n automation
 */

import { config as loadEnv } from 'dotenv';
import { N8nMcpServer } from './server.js';
import type { N8nMcpConfig } from './types/index.js';
import { join } from 'path';

// Load environment variables
loadEnv();

/**
 * Load configuration from environment
 */
function loadConfig(): N8nMcpConfig {
  const n8nApiUrl = process.env.N8N_API_URL;
  const n8nApiKey = process.env.N8N_API_KEY;

  if (!n8nApiUrl) {
    throw new Error('N8N_API_URL environment variable is required');
  }

  if (!n8nApiKey) {
    throw new Error('N8N_API_KEY environment variable is required');
  }

  const databasePath = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'nodes.db');
  const logLevel = (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error';
  const mcpMode = (process.env.MCP_MODE || 'stdio') as 'stdio' | 'http';

  return {
    n8nApiUrl,
    n8nApiKey,
    databasePath,
    logLevel,
    mcpMode
  };
}

/**
 * Main function
 */
async function main() {
  try {
    // Load configuration
    const config = loadConfig();

    // Create and start server
    const server = new N8nMcpServer(config);

    // Handle graceful shutdown
    const shutdown = async () => {
      console.error('\n[INFO] Shutting down gracefully...');
      await server.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('[ERROR] Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[ERROR] Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Start the server
    await server.start();

  } catch (error) {
    console.error('[FATAL] Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server
main();
