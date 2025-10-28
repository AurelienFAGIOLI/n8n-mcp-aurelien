/**
 * SQLite Database Client for n8n MCP
 * Manages storage and retrieval of nodes and templates
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DbNode, DbTemplate } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class N8nDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initializeSchema();
  }

  /**
   * Initialize database schema from SQL file
   */
  private initializeSchema(): void {
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema);
  }

  // ========== Node Operations ==========

  /**
   * Insert or update a node in the database
   */
  upsertNode(node: DbNode): void {
    const stmt = this.db.prepare(`
      INSERT INTO nodes (id, name, display_name, description, category, icon, documentation, parameters, examples, is_ai_node)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        display_name = excluded.display_name,
        description = excluded.description,
        category = excluded.category,
        icon = excluded.icon,
        documentation = excluded.documentation,
        parameters = excluded.parameters,
        examples = excluded.examples,
        is_ai_node = excluded.is_ai_node
    `);

    stmt.run(
      node.id,
      node.name,
      node.displayName,
      node.description,
      node.category,
      node.icon || null,
      node.documentation || null,
      node.parameters,
      node.examples || null,
      node.isAiNode ? 1 : 0
    );
  }

  /**
   * Bulk insert nodes (more efficient for initial seeding)
   */
  insertNodes(nodes: DbNode[]): void {
    const insert = this.db.transaction((nodes: DbNode[]) => {
      for (const node of nodes) {
        this.upsertNode(node);
      }
    });

    insert(nodes);
  }

  /**
   * Search nodes using full-text search
   */
  searchNodes(query: string, options: {
    category?: string;
    aiOnly?: boolean;
    limit?: number;
  } = {}): DbNode[] {
    const { category, aiOnly, limit = 20 } = options;

    let sql = `
      SELECT n.*
      FROM nodes n
      JOIN nodes_fts fts ON n.rowid = fts.rowid
      WHERE nodes_fts MATCH ?
    `;

    const params: any[] = [query];

    if (category) {
      sql += ` AND n.category = ?`;
      params.push(category);
    }

    if (aiOnly) {
      sql += ` AND n.is_ai_node = 1`;
    }

    sql += ` LIMIT ?`;
    params.push(limit);

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      icon: row.icon,
      documentation: row.documentation,
      parameters: row.parameters,
      examples: row.examples,
      isAiNode: row.is_ai_node === 1
    }));
  }

  /**
   * Get node by exact name
   */
  getNodeByName(name: string): DbNode | null {
    const stmt = this.db.prepare(`
      SELECT * FROM nodes WHERE name = ?
    `);

    const row = stmt.get(name) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      displayName: row.display_name,
      description: row.description,
      category: row.category,
      icon: row.icon,
      documentation: row.documentation,
      parameters: row.parameters,
      examples: row.examples,
      isAiNode: row.is_ai_node === 1
    };
  }

  /**
   * Get all node categories
   */
  getNodeCategories(): string[] {
    const stmt = this.db.prepare(`
      SELECT DISTINCT category FROM nodes WHERE category IS NOT NULL ORDER BY category
    `);

    return stmt.all().map((row: any) => row.category);
  }

  /**
   * Count total nodes
   */
  countNodes(): number {
    const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM nodes`);
    const row = stmt.get() as any;
    return row.count;
  }

  // ========== Template Operations ==========

  /**
   * Insert a template
   */
  insertTemplate(template: Omit<DbTemplate, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO templates (name, description, workflow_json, nodes, category, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      template.name,
      template.description,
      template.workflowJson,
      template.nodes,
      template.category || null,
      template.tags || null
    );

    return info.lastInsertRowid as number;
  }

  /**
   * Bulk insert templates
   */
  insertTemplates(templates: Array<Omit<DbTemplate, 'id'>>): void {
    const insert = this.db.transaction((templates: Array<Omit<DbTemplate, 'id'>>) => {
      for (const template of templates) {
        this.insertTemplate(template);
      }
    });

    insert(templates);
  }

  /**
   * Search templates using full-text search
   */
  searchTemplates(query: string, options: {
    category?: string;
    requiredNodes?: string[];
    limit?: number;
  } = {}): DbTemplate[] {
    const { category, requiredNodes, limit = 20 } = options;

    let sql = `
      SELECT t.*
      FROM templates t
      JOIN templates_fts fts ON t.id = fts.rowid
      WHERE templates_fts MATCH ?
    `;

    const params: any[] = [query];

    if (category) {
      sql += ` AND t.category = ?`;
      params.push(category);
    }

    if (requiredNodes && requiredNodes.length > 0) {
      for (const node of requiredNodes) {
        sql += ` AND t.nodes LIKE ?`;
        params.push(`%${node}%`);
      }
    }

    sql += ` LIMIT ?`;
    params.push(limit);

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      workflowJson: row.workflow_json,
      nodes: row.nodes,
      category: row.category,
      tags: row.tags,
      createdAt: row.created_at
    }));
  }

  /**
   * Get template by ID
   */
  getTemplateById(id: number): DbTemplate | null {
    const stmt = this.db.prepare(`
      SELECT * FROM templates WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      workflowJson: row.workflow_json,
      nodes: row.nodes,
      category: row.category,
      tags: row.tags,
      createdAt: row.created_at
    };
  }

  /**
   * Count total templates
   */
  countTemplates(): number {
    const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM templates`);
    const row = stmt.get() as any;
    return row.count;
  }

  /**
   * Get database statistics
   */
  getStats(): {
    totalNodes: number;
    totalTemplates: number;
    aiNodes: number;
    categories: number;
  } {
    const aiNodesResult = this.db.prepare(`SELECT COUNT(*) as count FROM nodes WHERE is_ai_node = 1`).get() as any;

    return {
      totalNodes: this.countNodes(),
      totalTemplates: this.countTemplates(),
      aiNodes: aiNodesResult.count,
      categories: this.getNodeCategories().length
    };
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }
}
