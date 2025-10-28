#!/bin/sh
set -e

# n8n MCP Server - Docker Entrypoint Script
# Ensures proper permissions and database initialization
# Runs as root, then switches to n8nmcp user

echo "[INFO] Starting n8n MCP Server entrypoint..."

# Ensure data directory exists with proper ownership
if [ ! -d "/app/data" ]; then
    echo "[INFO] Creating /app/data directory..."
    mkdir -p /app/data
fi

# Fix ownership and permissions for the data directory
echo "[INFO] Setting up /app/data permissions..."
chown -R n8nmcp:root /app/data
chmod -R 755 /app/data

# Initialize database if it doesn't exist
if [ ! -f "/app/data/nodes.db" ]; then
    echo "[INFO] Database not found, initializing..."

    # Check if sample data exists
    if [ -f "/app/dist/data/nodes-sample.json" ]; then
        # Copy sample data to persistent location
        cp /app/dist/data/nodes-sample.json /app/data/nodes-sample.json 2>/dev/null || true
    fi

    # Check if init script exists in dist
    if [ -f "/app/dist/scripts/init-db.js" ]; then
        echo "[INFO] Running database initialization script..."
        cd /app && su-exec n8nmcp node dist/scripts/init-db.js || echo "[WARN] Database initialization failed, will use empty database"
    else
        echo "[INFO] No init script found, database will be created on first use"
    fi
else
    echo "[INFO] Database found at /app/data/nodes.db"
    # Ensure existing database has correct permissions
    chown n8nmcp:root /app/data/nodes.db
    chmod 644 /app/data/nodes.db
fi

echo "[INFO] Permissions configured, starting MCP server..."

# Execute the main command (which will use su-exec to run as n8nmcp)
exec "$@"
