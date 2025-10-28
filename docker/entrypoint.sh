#!/bin/sh
set -e

# n8n MCP Server - Docker Entrypoint Script
# Ensures proper permissions and database initialization
# Runs as root, then switches to n8nmcp user
#
# IMPORTANT: All logs go to stderr (>&2) to keep stdout clean for MCP JSON-RPC protocol

echo "[INFO] Starting n8n MCP Server entrypoint..." >&2

# Ensure data directory exists with proper ownership
if [ ! -d "/app/data" ]; then
    echo "[INFO] Creating /app/data directory..." >&2
    mkdir -p /app/data
fi

# Fix ownership and permissions for the data directory
echo "[INFO] Setting up /app/data permissions..." >&2
chown -R n8nmcp:root /app/data
chmod -R 755 /app/data

# Initialize database if it doesn't exist
if [ ! -f "/app/data/nodes.db" ]; then
    echo "[INFO] Database not found, initializing..." >&2

    # Check if sample data exists
    if [ -f "/app/dist/data/nodes-sample.json" ]; then
        # Copy sample data to persistent location
        cp /app/dist/data/nodes-sample.json /app/data/nodes-sample.json 2>/dev/null || true
    fi

    # Check if init script exists in dist
    if [ -f "/app/dist/scripts/init-db.js" ]; then
        echo "[INFO] Running database initialization script..." >&2
        cd /app && su-exec n8nmcp node dist/scripts/init-db.js 2>&1 | sed 's/^/[INIT] /' >&2 || echo "[WARN] Database initialization failed, will use empty database" >&2
    else
        echo "[INFO] No init script found, database will be created on first use" >&2
    fi
else
    echo "[INFO] Database found at /app/data/nodes.db" >&2
    # Ensure existing database has correct permissions
    chown n8nmcp:root /app/data/nodes.db
    chmod 644 /app/data/nodes.db
fi

echo "[INFO] Permissions configured, starting MCP server..." >&2

# Execute the main command (which will use su-exec to run as n8nmcp)
exec "$@"
