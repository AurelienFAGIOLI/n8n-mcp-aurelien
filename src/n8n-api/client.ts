/**
 * n8n API Client
 * Communicates with n8n instance to manage workflows and executions
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  N8nWorkflow,
  N8nExecution,
  N8nApiResponse,
  N8nNode
} from '../types/index.js';

export class N8nApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(apiUrl: string, apiKey: string) {
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash

    this.client = axios.create({
      baseURL: `${this.baseUrl}/api/v1`,
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || axiosError.message;
      const status = axiosError.response?.status;
      throw new Error(`n8n API Error (${status}): ${message}`);
    }
    throw error;
  }

  // ========== Workflow Operations ==========

  /**
   * Get all workflows
   */
  async listWorkflows(options: {
    active?: boolean;
    tags?: string[];
    limit?: number;
  } = {}): Promise<N8nWorkflow[]> {
    try {
      const params: Record<string, any> = {};

      if (options.active !== undefined) {
        params.active = options.active;
      }

      if (options.tags && options.tags.length > 0) {
        params.tags = options.tags.join(',');
      }

      if (options.limit) {
        params.limit = options.limit;
      }

      const response = await this.client.get<{ data: N8nWorkflow[] }>('/workflows', {
        params
      });

      return response.data.data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a specific workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<N8nWorkflow> {
    try {
      const response = await this.client.get<{ data: N8nWorkflow }>(
        `/workflows/${workflowId}`
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: {
    name: string;
    nodes: N8nNode[];
    connections?: Record<string, any>;
    active?: boolean;
    settings?: Record<string, any>;
    tags?: string[];
  }): Promise<N8nWorkflow> {
    try {
      const response = await this.client.post<{ data: N8nWorkflow }>(
        '/workflows',
        {
          name: workflow.name,
          nodes: workflow.nodes,
          connections: workflow.connections || {},
          active: workflow.active || false,
          settings: workflow.settings || {},
          tags: workflow.tags || []
        }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    workflowId: string,
    updates: Partial<N8nWorkflow>
  ): Promise<N8nWorkflow> {
    try {
      const response = await this.client.patch<{ data: N8nWorkflow }>(
        `/workflows/${workflowId}`,
        updates
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      await this.client.delete(`/workflows/${workflowId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Activate a workflow
   */
  async activateWorkflow(workflowId: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(workflowId, { active: true });
  }

  /**
   * Deactivate a workflow
   */
  async deactivateWorkflow(workflowId: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(workflowId, { active: false });
  }

  // ========== Execution Operations ==========

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    data?: Record<string, any>
  ): Promise<N8nExecution> {
    try {
      const response = await this.client.post<{ data: N8nExecution }>(
        `/workflows/${workflowId}/execute`,
        data || {}
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get workflow executions
   */
  async getExecutions(
    workflowId?: string,
    options: {
      limit?: number;
      status?: 'success' | 'error' | 'running';
    } = {}
  ): Promise<N8nExecution[]> {
    try {
      const params: Record<string, any> = {
        limit: options.limit || 20
      };

      if (workflowId) {
        params.workflowId = workflowId;
      }

      if (options.status) {
        params.status = options.status;
      }

      const response = await this.client.get<{ data: N8nExecution[] }>(
        '/executions',
        { params }
      );

      return response.data.data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a specific execution
   */
  async getExecution(executionId: string): Promise<N8nExecution> {
    try {
      const response = await this.client.get<{ data: N8nExecution }>(
        `/executions/${executionId}`
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete an execution
   */
  async deleteExecution(executionId: string): Promise<void> {
    try {
      await this.client.delete(`/executions/${executionId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // ========== Utility Methods ==========

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/workflows', { params: { limit: 1 } });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the workflow URL in the n8n UI
   */
  getWorkflowUrl(workflowId: string): string {
    return `${this.baseUrl}/workflow/${workflowId}`;
  }

  /**
   * Get the execution URL in the n8n UI
   */
  getExecutionUrl(workflowId: string, executionId: string): string {
    return `${this.baseUrl}/workflow/${workflowId}/executions/${executionId}`;
  }
}
