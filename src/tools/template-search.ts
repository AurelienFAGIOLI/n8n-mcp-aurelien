/**
 * Template Search Tools
 * Search and retrieve workflow templates
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { N8nDatabase } from '../database/db.js';
import type { SearchTemplatesInput, SearchTemplatesOutput } from '../types/index.js';

export function registerTemplateTools(
  server: McpServer,
  db: N8nDatabase
): void {
  // ========== SEARCH TEMPLATES ==========

  server.registerTool(
    'search-templates',
    {
      title: 'Search Workflow Templates',
      description: 'Search through 2700+ pre-built n8n workflow templates',
      inputSchema: {
        query: z.string().describe('Search query describing the automation you need'),
        category: z.string().optional().describe('Filter by category'),
        nodes: z.array(z.string()).optional().describe('Required nodes (e.g., ["gmail", "slack"])'),
        limit: z.number().optional().describe('Maximum results (default: 10)')
      },
      outputSchema: {
        templates: z.array(z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          nodes: z.array(z.string()),
          category: z.string().optional()
        })),
        total: z.number()
      }
    },
    async (input: SearchTemplatesInput) => {
      try {
        const templates = db.searchTemplates(input.query, {
          category: input.category,
          requiredNodes: input.nodes,
          limit: input.limit || 10
        });

        const output: SearchTemplatesOutput = {
          templates: templates.map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            nodes: template.nodes.split(',').map(n => n.trim()),
            category: template.category
          })),
          total: templates.length
        };

        // Return structured output directly (required by MCP SDK with outputSchema)
        return output;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error searching templates: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== GET TEMPLATE ==========

  server.registerTool(
    'get-template',
    {
      title: 'Get Template Details',
      description: 'Get the full workflow JSON for a specific template',
      inputSchema: {
        templateId: z.number().describe('The ID of the template to retrieve')
      },
      outputSchema: {
        success: z.boolean(),
        template: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          workflowJson: z.string(),
          nodes: z.string(),
          category: z.string().optional(),
          tags: z.string().optional()
        }).optional(),
        error: z.string().optional()
      }
    },
    async (input: { templateId: number }) => {
      try {
        const template = db.getTemplateById(input.templateId);

        if (!template) {
          return {
            content: [{
              type: 'text',
              text: `❌ Template ${input.templateId} not found. Use search-templates to find available templates.`
            }],
            isError: true
          } as any;
        }

        const nodes = template.nodes.split(',').map(n => n.trim());

        let message = `📋 Template: ${template.name}\n\n`;
        message += `**ID:** ${template.id}\n`;
        if (template.category) {
          message += `**Category:** ${template.category}\n`;
        }
        message += `**Nodes:** ${nodes.join(', ')}\n`;
        if (template.tags) {
          message += `**Tags:** ${template.tags}\n`;
        }
        message += `\n**Description:**\n${template.description}\n\n`;
        message += `**Full Workflow JSON:**\n\`\`\`json\n${template.workflowJson}\n\`\`\`\n\n`;
        message += `💡 You can use this JSON to create a new workflow or modify it for your needs.`;

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
            text: `❌ Error getting template: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== GET DATABASE STATS ==========

  server.registerTool(
    'get-database-stats',
    {
      title: 'Get Database Statistics',
      description: 'Get statistics about the nodes and templates database',
      inputSchema: {},
      outputSchema: {
        totalNodes: z.number(),
        totalTemplates: z.number(),
        aiNodes: z.number(),
        categories: z.number()
      }
    },
    async () => {
      try {
        const stats = db.getStats();

        let message = `📊 n8n MCP Database Statistics\n\n`;
        message += `📦 Total Nodes: ${stats.totalNodes}\n`;
        message += `🤖 AI-Enabled Nodes: ${stats.aiNodes}\n`;
        message += `📂 Categories: ${stats.categories}\n`;
        message += `🎨 Workflow Templates: ${stats.totalTemplates}\n`;

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
            text: `❌ Error getting statistics: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );
}
