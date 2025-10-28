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

# Create non-root user
RUN adduser -S n8nmcp && \
    chown -R n8nmcp:root /app && \
    mkdir -p /app/data && \
    chown -R n8nmcp:root /app/data

USER n8nmcp

# Environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/nodes.db
ENV LOG_LEVEL=info
ENV MCP_MODE=stdio

# Volume for database
VOLUME ["/app/data"]

# Start the MCP server
CMD ["node", "dist/index.js"]
