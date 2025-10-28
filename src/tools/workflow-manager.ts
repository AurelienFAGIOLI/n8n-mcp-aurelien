/**
 * Workflow Management Tools
 * CRUD operations for n8n workflows
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { N8nApiClient } from '../n8n-api/client.js';
import type {
  ListWorkflowsInput,
  ListWorkflowsOutput,
  GetWorkflowInput,
  GetWorkflowOutput,
  UpdateWorkflowInput,
  UpdateWorkflowOutput
} from '../types/index.js';

export function registerWorkflowTools(
  server: McpServer,
  n8nClient: N8nApiClient
): void {
  // ========== LIST WORKFLOWS ==========

  server.registerTool(
    'list-workflows',
    {
      title: 'List n8n Workflows',
      description: 'List all workflows from your n8n instance with optional filters',
      inputSchema: {
        active: z.boolean().optional().describe('Filter by active status'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        search: z.string().optional().describe('Search in workflow names'),
        limit: z.number().optional().describe('Maximum number of workflows to return (default: 50)')
      }
    },
    async (input: ListWorkflowsInput) => {
      try {
        const workflows = await n8nClient.listWorkflows({
          active: input.active,
          tags: input.tags,
          limit: input.limit || 50
        });

        // Filter by search term if provided
        let filteredWorkflows = workflows;
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filteredWorkflows = workflows.filter(wf =>
            wf.name.toLowerCase().includes(searchLower)
          );
        }

        const output: ListWorkflowsOutput = {
          workflows: filteredWorkflows.map(wf => ({
            id: wf.id,
            name: wf.name,
            active: wf.active,
            tags: wf.tags,
            updatedAt: wf.updatedAt
          })),
          total: filteredWorkflows.length
        };

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(output, null, 2)
          }]
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{
            type: 'text',
            text: `Error listing workflows: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== GET WORKFLOW ==========

  server.registerTool(
    'get-workflow',
    {
      title: 'Get Workflow Details',
      description: 'Get full details of a specific workflow including nodes and connections',
      inputSchema: {
        workflowId: z.string().describe('The ID of the workflow to retrieve')
      }
    },
    async (input: GetWorkflowInput) => {
      try {
        const workflow = await n8nClient.getWorkflow(input.workflowId);

        const output: GetWorkflowOutput = {
          success: true,
          workflow
        };

        const workflowUrl = n8nClient.getWorkflowUrl(input.workflowId);

        return {
          content: [{
            type: 'text',
            text: `Workflow: ${workflow.name}\nStatus: ${workflow.active ? 'Active' : 'Inactive'}\nNodes: ${workflow.nodes.length}\nURL: ${workflowUrl}\n\nFull JSON:\n${JSON.stringify(workflow, null, 2)}`
          }]
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const output: GetWorkflowOutput = {
          success: false,
          error: errorMessage
        };

        return {
          content: [{
            type: 'text',
            text: `Error getting workflow: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== UPDATE WORKFLOW ==========

  server.registerTool(
    'update-workflow',
    {
      title: 'Update Workflow',
      description: 'Update an existing workflow (name, active status, nodes, etc.)',
      inputSchema: {
        workflowId: z.string().describe('The ID of the workflow to update'),
        changes: z.object({
          name: z.string().optional().describe('New name for the workflow'),
          active: z.boolean().optional().describe('Activate or deactivate the workflow'),
          nodes: z.array(z.any()).optional().describe('Updated nodes array'),
          tags: z.array(z.string()).optional().describe('Updated tags')
        }).describe('Changes to apply to the workflow')
      }
    },
    async (input: UpdateWorkflowInput) => {
      try {
        const updatedWorkflow = await n8nClient.updateWorkflow(
          input.workflowId,
          input.changes
        );

        const output: UpdateWorkflowOutput = {
          success: true,
          workflowId: updatedWorkflow.id
        };

        const workflowUrl = n8nClient.getWorkflowUrl(input.workflowId);

        return {
          content: [{
            type: 'text',
            text: `✅ Workflow updated successfully!\n\nWorkflow: ${updatedWorkflow.name}\nStatus: ${updatedWorkflow.active ? 'Active' : 'Inactive'}\nURL: ${workflowUrl}`
          }],
        } as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const output: UpdateWorkflowOutput = {
          success: false,
          error: errorMessage
        };

        return {
          content: [{
            type: 'text',
            text: `❌ Error updating workflow: ${errorMessage}`
          }],
          isError: true
        } as any;
      }
    }
  );

  // ========== DELETE WORKFLOW ==========

  server.registerTool(
    'delete-workflow',
    {
      title: 'Delete Workflow',
      description: 'Permanently delete a workflow from n8n',
      inputSchema: {
        workflowId: z.string().describe('The ID of the workflow to delete'),
        confirm: z.boolean().describe('Confirmation flag (must be true to delete)')
      }
    },
    async (input: { workflowId: string; confirm: boolean }) => {
      if (!input.confirm) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ Deletion cancelled. Set confirm=true to proceed with deletion.'
          }]
        };
      }

      try {
        await n8nClient.deleteWorkflow(input.workflowId);

        return {
          content: [{
            type: 'text',
            text: `✅ Workflow ${input.workflowId} deleted successfully.`
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error deleting workflow: ${errorMessage}`
          }],
          isError: true
        };
      }
    }
  );

  // ========== EXECUTE WORKFLOW ==========

  server.registerTool(
    'execute-workflow',
    {
      title: 'Execute Workflow',
      description: 'Trigger execution of a workflow',
      inputSchema: {
        workflowId: z.string().describe('The ID of the workflow to execute'),
        data: z.record(z.any()).optional().describe('Optional input data for the workflow')
      }
    },
    async (input: { workflowId: string; data?: Record<string, any> }) => {
      try {
        const execution = await n8nClient.executeWorkflow(input.workflowId, input.data);

        const executionUrl = n8nClient.getExecutionUrl(input.workflowId, execution.id);

        return {
          content: [{
            type: 'text',
            text: `✅ Workflow executed!\n\nExecution ID: ${execution.id}\nStatus: ${execution.finished ? 'Completed' : 'Running'}\nURL: ${executionUrl}`
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [{
            type: 'text',
            text: `❌ Error executing workflow: ${errorMessage}`
          }],
          isError: true
        };
      }
    }
  );
}
