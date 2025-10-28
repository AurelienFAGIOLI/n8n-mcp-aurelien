/**
 * Types for n8n MCP Server
 */

// ========== n8n API Types ==========

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, any>;
  settings?: Record<string, any>;
  staticData?: Record<string, any>;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, any>;
}

export interface N8nExecution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowData?: N8nWorkflow;
  data?: Record<string, any>;
}

export interface N8nApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ========== Database Types ==========

export interface DbNode {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon?: string;
  documentation?: string;
  parameters: string; // JSON string
  examples?: string; // JSON string
  isAiNode?: boolean;
}

export interface DbTemplate {
  id: number;
  name: string;
  description: string;
  workflowJson: string; // Full workflow JSON
  nodes: string; // Comma-separated node names
  category?: string;
  tags?: string; // Comma-separated tags
  createdAt?: string;
}

// ========== MCP Tool Types ==========

export interface CreateWorkflowInput {
  description: string;
  name?: string;
  useTemplate?: boolean;
}

export interface CreateWorkflowOutput {
  success: boolean;
  workflowId?: string;
  workflowUrl?: string;
  workflowName?: string;
  error?: string;
}

export interface ListWorkflowsInput {
  active?: boolean;
  tags?: string[];
  search?: string;
  limit?: number;
}

export interface ListWorkflowsOutput {
  workflows: Array<{
    id: string;
    name: string;
    active: boolean;
    tags?: string[];
    updatedAt?: string;
  }>;
  total: number;
}

export interface GetWorkflowInput {
  workflowId: string;
}

export interface GetWorkflowOutput {
  success: boolean;
  workflow?: N8nWorkflow;
  error?: string;
}

export interface UpdateWorkflowInput {
  workflowId: string;
  changes: {
    name?: string;
    active?: boolean;
    nodes?: N8nNode[];
    tags?: string[];
  };
}

export interface UpdateWorkflowOutput {
  success: boolean;
  workflowId?: string;
  error?: string;
}

export interface SearchNodesInput {
  query: string;
  category?: string;
  aiOnly?: boolean;
  limit?: number;
}

export interface SearchNodesOutput {
  nodes: Array<{
    name: string;
    displayName: string;
    description: string;
    category: string;
    isAiNode: boolean;
  }>;
  total: number;
}

export interface SearchTemplatesInput {
  query: string;
  category?: string;
  nodes?: string[];
  limit?: number;
}

export interface SearchTemplatesOutput {
  templates: Array<{
    id: number;
    name: string;
    description: string;
    nodes: string[];
    category?: string;
  }>;
  total: number;
}

export interface ExecuteWorkflowInput {
  workflowId: string;
  data?: Record<string, any>;
}

export interface ExecuteWorkflowOutput {
  success: boolean;
  executionId?: string;
  status?: string;
  error?: string;
}

// ========== Configuration Types ==========

export interface N8nMcpConfig {
  n8nApiUrl: string;
  n8nApiKey: string;
  databasePath: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  mcpMode: 'stdio' | 'http';
}
