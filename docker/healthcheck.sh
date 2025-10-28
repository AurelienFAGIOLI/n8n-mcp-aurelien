#!/bin/sh
# Healthcheck script for n8n MCP Server

# Check if database file exists
if [ ! -f "/app/data/nodes.db" ]; then
  echo "Database file not found"
  exit 1
fi

# Check if process is running
if ! pgrep -x "node" > /dev/null; then
  echo "Node process not running"
  exit 1
fi

echo "Health check passed"
exit 0
