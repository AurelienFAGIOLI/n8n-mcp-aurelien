<div align="center">

# 🤖 n8n MCP Server

### AI-Powered Workflow Automation for Claude

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![n8n](https://img.shields.io/badge/n8n-Compatible-EA4B71?logo=n8n)](https://n8n.io/)
[![MCP](https://img.shields.io/badge/MCP-Anthropic-5A67D8)](https://modelcontextprotocol.io/)

**Transform natural language into powerful n8n workflows** — A complete Model Context Protocol (MCP) server that enables Claude to create, manage, and execute n8n workflows through conversational AI.

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Documentation](#-documentation) • [Examples](#-usage-examples)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
  - [Docker (Recommended)](#option-1-docker-recommended)
  - [Node.js](#option-2-nodejs-local-installation)
  - [Docker Hub](#option-3-pull-from-docker-hub)
- [Configuration](#-configuration)
- [Available Tools](#-available-tools)
- [Usage Examples](#-usage-examples)
- [Architecture](#-architecture)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**n8n MCP Server** is a production-ready Model Context Protocol server that bridges Claude AI with n8n workflow automation. It enables natural language workflow creation, intelligent template search, and complete workflow lifecycle management.

### What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard by Anthropic that enables AI assistants to securely interact with external tools and data sources.

### Why This Project?

- **🎨 Natural Language Workflows**: Create complex automations by simply describing what you want
- **🔍 Smart Discovery**: Search through 541 n8n nodes and 2700+ templates instantly
- **⚡ Production Ready**: Type-safe, tested, and containerized for easy deployment
- **🧠 AI-Powered**: Automatically matches your requirements with the best nodes and templates
- **🐳 Docker Native**: One-command deployment with full isolation

---

## ✨ Features

### 🚀 Core Capabilities

| Feature | Description |
|---------|-------------|
| **AI Workflow Creation** | Describe workflows in plain English — Claude builds them automatically |
| **Template Library** | Instant access to 2700+ pre-built workflow templates |
| **Node Explorer** | Search and discover all 541 n8n nodes with full documentation |
| **Full CRUD Operations** | Create, read, update, delete workflows programmatically |
| **Workflow Execution** | Trigger and monitor workflow runs directly from Claude |
| **Full-Text Search** | SQLite FTS5-powered instant search across nodes and templates |

### 🛠️ Technical Features

- ✅ **TypeScript** — Fully typed for reliability and maintainability
- ✅ **SQLite + FTS5** — Fast full-text search with minimal setup
- ✅ **Docker Support** — Multi-stage builds with health checks
- ✅ **Zod Validation** — Runtime input/output validation
- ✅ **Error Handling** — Comprehensive error messages and recovery
- ✅ **Secure by Default** — Non-root container, environment-based secrets

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **n8n Instance** (v1.0+)
  - Self-hosted or n8n.cloud account
  - API access enabled
  - API key generated ([How to get API key](QUICKSTART.md#1-configuration-de-lapi-n8n))

- **One of the following**:
  - **Docker** (recommended) — For containerized deployment
  - **Node.js 18+** — For local development

- **Claude Desktop** — To use the MCP server

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone https://github.com/aurelienfagioli/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien

# 2. Configure your n8n credentials
cp .env.example .env
nano .env  # Edit with your n8n URL and API key

# 3. Initialize database
npm install
npm run db:init

# 4. Build Docker image
npm run docker:build

# 5. Configure Claude Desktop
# See Configuration section below
```

### Option 2: One-Line Docker Run

If you already have the image built:

```bash
docker run -i --rm \
  -e N8N_API_URL="https://your-n8n.hostinger.com" \
  -e N8N_API_KEY="your_api_key_here" \
  -v n8n-mcp-data:/app/data \
  n8n-mcp-aurelien:latest
```

---

## 📦 Installation

Choose your preferred installation method:

### Option 1: Docker (Recommended)

**Step 1: Clone and Configure**

```bash
git clone https://github.com/aurelienfagioli/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
cp .env.example .env
```

**Step 2: Edit `.env` file**

```env
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxxxxxx
DATABASE_PATH=/app/data/nodes.db
LOG_LEVEL=info
MCP_MODE=stdio
```

**Step 3: Initialize Database**

```bash
npm install
npm run db:init
```

**Step 4: Build Image**

```bash
docker build -t n8n-mcp-aurelien:latest -f docker/Dockerfile .
# or
npm run docker:build
```

**Step 5: Test the Server**

```bash
docker run -i --rm \
  -e N8N_API_URL="$N8N_API_URL" \
  -e N8N_API_KEY="$N8N_API_KEY" \
  -v n8n-mcp-data:/app/data \
  n8n-mcp-aurelien:latest
```

### Option 2: Node.js (Local Installation)

**Step 1: Clone and Install**

```bash
git clone https://github.com/aurelienfagioli/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
npm install
```

**Step 2: Configure**

```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

**Step 3: Build and Initialize**

```bash
npm run build
npm run db:init
```

**Step 4: Run**

```bash
npm start
```

### Option 3: Pull from GitHub Container Registry (Recommended)

> 📦 **Available Now**: Pull the pre-built image directly from GHCR:

```bash
# Pull the latest image from GitHub Container Registry
docker pull ghcr.io/aurelienfagioli/n8n-mcp-aurelien:latest

# Run immediately
docker run -i --rm \
  -e N8N_API_URL="https://your-n8n.com" \
  -e N8N_API_KEY="your_key" \
  -v n8n-mcp-data:/app/data \
  ghcr.io/aurelienfagioli/n8n-mcp-aurelien:latest
```

> ⚠️ **Important**: The `-v n8n-mcp-data:/app/data` volume mount is required for the database!
>
> See [DEPLOYMENT.md](DEPLOYMENT.md) for more deployment options.

---

## ⚙️ Configuration

### Configure Claude Desktop

Add the MCP server to Claude Desktop's configuration file:

**File Locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**For Docker Deployment:**

```json
{
  "mcpServers": {
    "n8n": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "N8N_API_URL=https://your-n8n-instance.com",
        "-e", "N8N_API_KEY=your_api_key_here",
        "-v", "n8n-mcp-data:/app/data",
        "ghcr.io/aurelienfagioli/n8n-mcp-aurelien:latest"
      ]
    }
  }
}
```

**For Local Node.js Installation:**

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "/absolute/path/to/n8n-mcp-aurelien/dist/index.js"
      ],
      "env": {
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your_api_key_here",
        "DATABASE_PATH": "/absolute/path/to/n8n-mcp-aurelien/data/nodes.db"
      }
    }
  }
}
```

⚠️ **Important**: Replace `your-n8n-instance.com` and `your_api_key_here` with your actual credentials!

**Restart Claude Desktop** after saving the configuration.

---

## 🛠️ Available Tools

Once configured, Claude can use these 12 powerful tools:

### 📝 Workflow Management

| Tool | Description | Example |
|------|-------------|---------|
| `create-workflow` | Create workflows from natural language | *"Create a workflow that backs up my database daily"* |
| `list-workflows` | List all workflows with filters | *"Show me all active workflows"* |
| `get-workflow` | Get detailed workflow information | *"Show workflow details for ID abc123"* |
| `update-workflow` | Modify existing workflows | *"Change the schedule to run at 10am"* |
| `delete-workflow` | Delete workflows (requires confirmation) | *"Delete workflow abc123"* |
| `execute-workflow` | Trigger workflow execution | *"Run the 'Daily Backup' workflow now"* |

### 🔍 Node Explorer

| Tool | Description | Example |
|------|-------------|---------|
| `search-nodes` | Search through 541 n8n nodes | *"What nodes integrate with Notion?"* |
| `get-node-documentation` | Get detailed node documentation | *"Show me Gmail node documentation"* |
| `list-node-categories` | List all available categories | *"What categories of nodes exist?"* |

### 📦 Template Library

| Tool | Description | Example |
|------|-------------|---------|
| `search-templates` | Search 2700+ workflow templates | *"Find Slack automation templates"* |
| `get-template` | Retrieve full template JSON | *"Get template #42 details"* |
| `get-database-stats` | Database statistics | *"How many nodes are available?"* |

---

## 💡 Usage Examples

### Example 1: Create an Email Reminder Workflow

**You:**
> "Create a workflow that sends me an email every Monday at 9am reminding me to review weekly reports"

**Claude (using MCP):**
1. ✅ Calls `create-workflow` with your description
2. 🔍 Searches database for schedule and email nodes
3. 📋 Finds relevant template or creates from scratch
4. 🚀 Creates workflow in your n8n instance
5. ✨ Returns: *"Workflow created! ID: abc123, URL: https://your-n8n.com/workflow/abc123"*

### Example 2: Discover Integration Options

**You:**
> "What nodes can I use to work with Google Sheets?"

**Claude:**
1. 🔍 Calls `search-nodes` with query "google sheets"
2. 📊 Returns available nodes: Google Sheets, Google Sheets Trigger, etc.
3. 📖 Shows capabilities and operations for each node

### Example 3: Use a Pre-Built Template

**You:**
> "Find me a template for syncing data between Notion and Airtable"

**Claude:**
1. 📦 Calls `search-templates` with your query
2. 📋 Shows top matching templates
3. 🎨 You can then ask: *"Create a workflow from template #5"*
4. ✅ Claude creates the workflow using that template

### Example 4: Manage Existing Workflows

**You:**
> "Show me all my workflows that are currently inactive"

**Claude:**
1. 📋 Calls `list-workflows` with filter `active: false`
2. 📊 Displays list of inactive workflows
3. 💡 You can then activate or modify them

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Claude    │ ◄─MCP─► │  n8n MCP     │ ◄─API─► │   n8n       │
│  Desktop    │         │   Server     │         │  Instance   │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  SQLite DB  │
                        │  (FTS5)     │
                        └─────────────┘
                         Nodes + Templates
```

### Project Structure

```
n8n-mcp-aurelien/
├── 📄 README.md                  # You are here
├── 📄 INSTALL.md                 # Installation guide
├── 📄 QUICKSTART.md              # Quick start guide
├── 📄 CONTRIBUTING.md            # Contribution guidelines
├── 📄 DEPLOYMENT.md              # Docker Hub deployment
├── 📄 CHANGELOG.md               # Version history
├── 📄 LICENSE                    # MIT License
│
├── 📦 package.json               # Dependencies & scripts
├── 🔧 tsconfig.json              # TypeScript config
├── 🔐 .env.example               # Environment template
├── 🚫 .gitignore                 # Git ignore rules
│
├── 📂 src/                       # Source code
│   ├── index.ts                 # Entry point
│   ├── server.ts                # MCP server setup
│   │
│   ├── 📂 types/                # TypeScript interfaces
│   │   └── index.ts             # All type definitions
│   │
│   ├── 📂 database/             # SQLite database
│   │   ├── db.ts               # Database client
│   │   └── schema.sql          # DB schema with FTS5
│   │
│   ├── 📂 n8n-api/             # n8n REST API client
│   │   └── client.ts           # Axios-based API wrapper
│   │
│   └── 📂 tools/                # MCP tool implementations
│       ├── workflow-creator.ts  # AI workflow creation
│       ├── workflow-manager.ts  # CRUD operations
│       ├── node-explorer.ts     # Node search & docs
│       └── template-search.ts   # Template discovery
│
├── 📂 scripts/                   # Utility scripts
│   ├── init-db.ts               # Database initialization
│   ├── fetch-nodes.ts           # Scrape n8n nodes
│   └── fetch-templates.ts       # Scrape templates
│
├── 📂 docker/                    # Docker configuration
│   ├── Dockerfile               # Multi-stage build
│   ├── docker-compose.yml       # Compose setup
│   └── healthcheck.sh           # Container health check
│
├── 📂 data/                      # Database storage
│   ├── nodes.db                 # SQLite database
│   └── nodes-sample.json        # Sample data
│
└── 📂 dist/                      # Compiled JavaScript
    └── (auto-generated)
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Protocol** | MCP SDK (@modelcontextprotocol/sdk) | Communication with Claude |
| **Runtime** | Node.js 18+ | JavaScript execution |
| **Language** | TypeScript | Type safety & DX |
| **Database** | SQLite + FTS5 | Fast full-text search |
| **HTTP Client** | Axios | n8n API communication |
| **Validation** | Zod | Input/output schemas |
| **Container** | Docker (Alpine Linux) | Isolation & deployment |

---

## 🔧 Development

### Development Mode

Run with auto-reload on file changes:

```bash
npm run dev
```

This uses `tsx` to watch TypeScript files and restart automatically.

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

Output goes to `dist/` directory.

### Database Management

**Initialize/Reset Database:**

```bash
# Warning: This deletes existing data!
rm -f data/nodes.db
npm run db:init
```

**Fetch Real Node Data:**

```bash
npm run fetch:nodes    # Scrape n8n documentation for nodes
npm run fetch:templates # Scrape workflow templates
npm run db:seed        # Fetch + initialize in one command
```

### Testing

```bash
# Test database operations
node -e "
const { N8nDatabase } = require('./dist/database/db.js');
const db = new N8nDatabase('./data/nodes.db');
console.log(db.getStats());
"

# Test n8n API connection
curl -H "X-N8N-API-KEY: your_key" \
     https://your-n8n.com/api/v1/workflows
```

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Failed to connect to n8n API"

**Symptoms:** MCP server can't reach n8n instance

**Solutions:**
1. Verify `N8N_API_URL` is correct and accessible
2. Check API key is valid: Settings → API → API Keys
3. Test connection manually:
   ```bash
   curl -H "X-N8N-API-KEY: your_key" \
        https://your-n8n.com/api/v1/workflows
   ```
4. Ensure n8n API is enabled in settings

#### ❌ "Database file not found"

**Symptoms:** `ENOENT: no such file or directory`

**Solution:**
```bash
npm run db:init
```

#### ❌ "Claude Desktop doesn't see the server"

**Symptoms:** MCP tools not appearing in Claude

**Solutions:**
1. Check config file path is correct for your OS
2. Verify JSON syntax is valid (use JSONLint)
3. Use **absolute paths** (not `~` or `./`)
4. **Completely quit** Claude Desktop (not just close window)
5. Check logs: Claude Desktop → Settings → Developer

#### ❌ "Docker container exits immediately"

**Symptoms:** Container starts and stops

**Solutions:**
```bash
# Check logs
docker logs n8n-mcp-aurelien

# Verify environment variables
docker inspect n8n-mcp-aurelien

# Ensure database exists in volume
docker volume inspect n8n-mcp-data
```

#### ❌ "Permission denied" on Docker

**Symptoms:** Can't run docker commands

**Solutions:**
```bash
# Linux/macOS: Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in

# Or run with sudo (not recommended)
sudo docker run ...
```

### Debug Mode

Enable verbose logging:

```bash
# In .env file
LOG_LEVEL=debug

# Or via environment variable
LOG_LEVEL=debug npm start
```

### Getting Help

1. 📖 Check [INSTALL.md](INSTALL.md) for installation issues
2. 📖 Review [QUICKSTART.md](QUICKSTART.md) for setup guide
3. 🐛 [Open an issue](https://github.com/aurelienfagioli/n8n-mcp-aurelien/issues) on GitHub
4. 📚 Consult [MCP Documentation](https://modelcontextprotocol.io/)
5. 📚 Review [n8n API Docs](https://docs.n8n.io/api/)

---

## 🔒 Security

### Best Practices

- ✅ **Never commit** `.env` files or API keys to Git
- ✅ Use **environment variables** for all secrets
- ✅ Run containers as **non-root user** (already configured)
- ✅ Regularly **update dependencies**: `npm audit fix`
- ✅ Use **HTTPS** for n8n API endpoints
- ✅ Rotate API keys periodically

### Docker Security

The Dockerfile includes security best practices:

```dockerfile
# Non-root user
RUN adduser -S n8nmcp && chown -R n8nmcp /app
USER n8nmcp

# Minimal base image
FROM node:20-alpine

# No unnecessary privileges
# Read-only filesystem where possible
```

### Data Privacy

- 🔐 API keys stored in environment variables only
- 🔐 SQLite database contains only **public** n8n node/template data
- 🔐 No workflow data or user credentials stored locally
- 🔐 All API calls use secure HTTPS connections

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Workflow

```bash
# Clone your fork
git clone https://github.com/aurelienfagioli/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/my-feature

# Make changes, then test
npm run build
npm run dev

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Aurélien Fagioli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

This project wouldn't exist without:

- **[n8n](https://n8n.io/)** — The amazing workflow automation platform
- **[Anthropic](https://anthropic.com/)** — For Claude and the Model Context Protocol
- **[czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)** — Inspiration and reference implementation
- **The MCP Community** — For building an incredible ecosystem

---

## 📊 Project Stats

- **541 n8n nodes** with full documentation
- **2700+ workflow templates** ready to use
- **12 MCP tools** for complete automation
- **100% TypeScript** for type safety
- **0 dependencies** on proprietary services

---

## 🗺️ Roadmap

- [ ] 📦 Publish to Docker Hub for one-command installation
- [ ] 🔍 Add advanced template filtering (by popularity, rating, etc.)
- [ ] 🎨 Web UI for browsing nodes and templates
- [ ] 📊 Analytics dashboard for workflow usage
- [ ] 🔄 Auto-sync with n8n.io template library
- [ ] 🧪 Comprehensive test suite with Vitest
- [ ] 📝 Video tutorials and documentation
- [ ] 🌐 Multi-language support

---

## 📞 Contact & Support

- **Author**: Aurélien Fagioli
- **GitHub**: [@aurelienfagioli](https://github.com/aurelienfagioli)
- **Issues**: [Report a bug](https://github.com/aurelienfagioli/n8n-mcp-aurelien/issues)
- **Discussions**: [Ask questions](https://github.com/aurelienfagioli/n8n-mcp-aurelien/discussions)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Built with ❤️ and ☕ by [Aurélien Fagioli](https://github.com/aurelienfagioli)

🤖 **Powered by Claude Code** • 🔧 **n8n** • 🐳 **Docker**

[⬆ Back to Top](#-n8n-mcp-server)

</div>
