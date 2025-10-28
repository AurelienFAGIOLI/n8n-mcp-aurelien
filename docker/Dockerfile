# Multi-stage build for n8n MCP Server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy database schema
COPY src/database/schema.sql ./dist/database/schema.sql

# Copy sample data for initialization
COPY data/nodes-sample.json ./dist/data/nodes-sample.json

# Copy initialization scripts (pre-compiled from host)
COPY scripts/init-db.js ./dist/scripts/init-db.js

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh

# Make entrypoint executable
RUN chmod +x /entrypoint.sh && \
    mkdir -p /app/data

# Environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/nodes.db
ENV LOG_LEVEL=info
ENV MCP_MODE=stdio

# Volume for database
VOLUME ["/app/data"]

# Set entrypoint to handle permissions and initialization
ENTRYPOINT ["/entrypoint.sh"]

# Start the MCP server (runs as root for now to avoid env var issues)
CMD ["node", "dist/index.js"]
