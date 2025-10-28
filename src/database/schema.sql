-- n8n MCP Database Schema

-- Nodes table: stores information about all 541 n8n nodes
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    documentation TEXT,
    parameters TEXT, -- JSON string with parameter schemas
    examples TEXT, -- JSON string with usage examples
    is_ai_node INTEGER DEFAULT 0, -- 1 if it's an AI/LangChain node
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nodes_name ON nodes(name);
CREATE INDEX IF NOT EXISTS idx_nodes_category ON nodes(category);
CREATE INDEX IF NOT EXISTS idx_nodes_is_ai ON nodes(is_ai_node);

-- Templates table: stores workflow templates
CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    workflow_json TEXT NOT NULL, -- Full n8n workflow JSON
    nodes TEXT, -- Comma-separated list of node types used
    category TEXT,
    tags TEXT, -- Comma-separated tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_name ON templates(name);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- Full-text search for nodes
CREATE VIRTUAL TABLE IF NOT EXISTS nodes_fts USING fts5(
    name,
    display_name,
    description,
    documentation,
    content=nodes,
    content_rowid=rowid
);

-- Triggers to keep FTS table in sync
CREATE TRIGGER IF NOT EXISTS nodes_fts_insert AFTER INSERT ON nodes BEGIN
    INSERT INTO nodes_fts(rowid, name, display_name, description, documentation)
    VALUES (new.rowid, new.name, new.display_name, new.description, new.documentation);
END;

CREATE TRIGGER IF NOT EXISTS nodes_fts_delete AFTER DELETE ON nodes BEGIN
    DELETE FROM nodes_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS nodes_fts_update AFTER UPDATE ON nodes BEGIN
    DELETE FROM nodes_fts WHERE rowid = old.rowid;
    INSERT INTO nodes_fts(rowid, name, display_name, description, documentation)
    VALUES (new.rowid, new.name, new.display_name, new.description, new.documentation);
END;

-- Full-text search for templates
CREATE VIRTUAL TABLE IF NOT EXISTS templates_fts USING fts5(
    name,
    description,
    nodes,
    tags,
    content=templates,
    content_rowid=id
);

CREATE TRIGGER IF NOT EXISTS templates_fts_insert AFTER INSERT ON templates BEGIN
    INSERT INTO templates_fts(rowid, name, description, nodes, tags)
    VALUES (new.id, new.name, new.description, new.nodes, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS templates_fts_delete AFTER DELETE ON templates BEGIN
    DELETE FROM templates_fts WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS templates_fts_update AFTER UPDATE ON templates BEGIN
    DELETE FROM templates_fts WHERE rowid = old.id;
    INSERT INTO templates_fts(rowid, name, description, nodes, tags)
    VALUES (new.id, new.name, new.description, new.nodes, new.tags);
END;
