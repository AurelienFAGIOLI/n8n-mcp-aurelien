/**
 * Workflow Creator Tool
 * AI-assisted workflow creation using templates from database
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { N8nApiClient } from '../n8n-api/client.js';
import { N8nDatabase } from '../database/db.js';
import type {
  CreateWorkflowInput,
  CreateWorkflowOutput,
  N8nNode,
  N8nWorkflow
} from '../types/index.js';

export function registerWorkflowCreatorTool(
  server: McpServer,
  n8nClient: N8nApiClient,
  db: N8nDatabase
): void {
  server.registerTool(
    'create-workflow',
    {
      title: 'Create Workflow from Description',
      description: 'Create a new n8n workflow from a natural language description. Automatically searches for similar templates and nodes.',
      inputSchema: {
        description: z.string().describe('Natural language description of the workflow (e.g., "Send email every Monday at 9am")'),
        name: z.string().optional().describe('Custom name for the workflow'),
        useTemplate: z.boolean().optional().describe('Whether to search for and use a similar template (default: true)')
      },
      outputSchema: {
        success: z.boolean(),
        workflowId: z.string().optional(),
        workflowUrl: z.string().optional(),
        workflowName: z.string().optional(),
        error: z.string().optional()
      }
    },
    async (input: CreateWorkflowInput) => {
      try {
        const { description, name, useTemplate = true } = input;

        // Extract keywords from description for template/node search
        const keywords = extractKeywords(description);
        const searchQuery = keywords.join(' OR ');

        let workflowJson: Partial<N8nWorkflow> | null = null;
        let templateUsed: string | null = null;

        // Step 1: Try to find a similar template
        if (useTemplate && keywords.length > 0) {
          const templates = db.searchTemplates(searchQuery, { limit: 3 });

          if (templates.length > 0) {
            // Use the best matching template
            const template = templates[0];
            templateUsed = template.name;

            try {
              workflowJson = JSON.parse(template.workflowJson);
            } catch (e) {
              // Template JSON invalid, continue without it
              workflowJson = null;
            }
          }
        }

        // Step 2: If no template found or useTemplate is false, create from scratch
        if (!workflowJson) {
          // Search for relevant nodes
          const nodes = db.searchNodes(searchQuery, { limit: 10 });

          // Build a basic workflow structure
          workflowJson = {
            nodes: [],
            connections: {}
          };

          // Add suggested nodes with basic configuration
          if (nodes.length > 0) {
            workflowJson.nodes = nodes.slice(0, 3).map((node, index) => ({
              id: `node-${index}`,
              name: node.name,
              type: node.name,
              typeVersion: 1,
              position: [250 + (index * 300), 300] as [number, number],
              parameters: {}
            }));
          } else {
            // Fallback: create a simple manual trigger workflow
            workflowJson.nodes = [
              {
                id: 'manual-trigger',
                name: 'When clicking "Execute Workflow"',
                type: 'n8n-nodes-base.manualTrigger',
                typeVersion: 1,
                position: [250, 300] as [number, number],
                parameters: {}
              }
            ];
          }
        }

        // Step 3: Determine workflow name
        const workflowName = name || generateWorkflowName(description);

        // Step 4: Create the workflow via n8n API
        const createdWorkflow = await n8nClient.createWorkflow({
          name: workflowName,
          nodes: workflowJson.nodes || [],
          connections: workflowJson.connections || {},
          active: false, // Created as inactive by default
          tags: ['mcp-created', ...(templateUsed ? ['from-template'] : ['from-scratch'])]
        });

        const workflowUrl = n8nClient.getWorkflowUrl(createdWorkflow.id);

        const output: CreateWorkflowOutput = {
          success: true,
          workflowId: createdWorkflow.id,
          workflowUrl,
          workflowName: createdWorkflow.name
        };

        let message = `✅ Workflow created successfully!\n\n`;
        message += `📝 Name: ${createdWorkflow.name}\n`;
        message += `🆔 ID: ${createdWorkflow.id}\n`;
        message += `🔗 URL: ${workflowUrl}\n`;
        message += `📊 Nodes: ${createdWorkflow.nodes.length}\n`;
        message += `🏷️ Tags: ${createdWorkflow.tags?.join(', ') || 'none'}\n`;

        if (templateUsed) {
          message += `\n🎯 Based on template: "${templateUsed}"\n`;
        }

        message += `\n💡 Tip: The workflow is created as inactive. Use update-workflow to activate it once you've reviewed the configuration.`;

        return {
          content: [{
            type: 'text',
            text: message
          }],
        } as any;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const output: CreateWorkflowOutput = {
          success: false,
          error: errorMessage
        };

        return {
          content: [{
            type: 'text',
            text: `❌ Error creating workflow: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );
}

/**
 * Extract relevant keywords from description for searching
 */
function extractKeywords(description: string): string[] {
  // Common words to filter out
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'every', 'when', 'me', 'my', 'i'
  ]);

  // Extract words
  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Remove duplicates
  return [...new Set(words)];
}

/**
 * Generate a workflow name from description
 */
function generateWorkflowName(description: string): string {
  // Truncate and capitalize
  const truncated = description.length > 60
    ? description.substring(0, 57) + '...'
    : description;

  // Capitalize first letter
  return truncated.charAt(0).toUpperCase() + truncated.slice(1);
}
