# Multi-stage build for n8n MCP Server

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY scripts ./scripts

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database/schema.sql ./dist/database/schema.sql

# Create data directory
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV MCP_MODE=stdio
ENV LOG_LEVEL=info
ENV DATABASE_PATH=/app/data/nodes.db

# Add healthcheck script
COPY docker/healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /healthcheck.sh

# Run as non-root user
RUN addgroup -g 1001 -S n8nmcp && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G n8nmcp -g n8nmcp n8nmcp && \
    chown -R n8nmcp:n8nmcp /app

USER n8nmcp

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
