# n8n MCP Server - Aurélien Edition

![n8n MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

**Complete Model Context Protocol (MCP) server for n8n automation**. Enables Claude to create, manage, and execute n8n workflows through natural language.

> 📦 **Installation depuis GitHub** : Consultez [INSTALL.md](INSTALL.md) pour les instructions complètes d'installation avec Docker ou Node.js.

## 🎯 Features

- **📝 Workflow Creation**: Create workflows from natural language descriptions
- **🔍 Smart Template Search**: Access 2700+ pre-built workflow templates
- **📊 Node Explorer**: Search and explore 541 n8n nodes with full documentation
- **⚙️ Full CRUD Operations**: List, read, update, delete workflows
- **🚀 Workflow Execution**: Trigger and monitor workflow runs
- **🗄️ SQLite Database**: Fast full-text search across nodes and templates
- **🐳 Docker Support**: Easy deployment with Docker/Docker Compose
- **🤖 AI-Powered**: Automatically finds relevant nodes and templates

## 📋 Prerequisites

- **Node.js** 18+ (if running locally)
- **Docker** (if using Docker deployment)
- **n8n instance** with API access (self-hosted or n8n.cloud)
- **n8n API Key**

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd n8n-mcp-aurelien
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
N8N_API_URL=https://your-n8n.hostinger.com
N8N_API_KEY=your_api_key_here
DATABASE_PATH=./data/nodes.db
LOG_LEVEL=info
MCP_MODE=stdio
```

### 3. Initialize Database

```bash
# Fetch nodes information (creates sample data)
npm run fetch:nodes

# Initialize SQLite database
npm run db:init
```

### 4. Build & Run

```bash
# Build TypeScript
npm run build

# Run the server
npm start
```

## 🐳 Docker Deployment

### Build Image

```bash
npm run docker:build
```

### Run with Docker Compose

Create a `.env` file, then:

```bash
npm run docker:run
```

Or manually:

```bash
docker run -i --rm \
  -e N8N_API_URL=https://your-n8n.hostinger.com \
  -e N8N_API_KEY=your_key \
  -v n8n-mcp-data:/app/data \
  n8n-mcp-aurelien:latest
```

## ⚙️ Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "N8N_API_URL=https://your-n8n.hostinger.com",
        "-e", "N8N_API_KEY=your_api_key",
        "-v", "n8n-mcp-data:/app/data",
        "n8n-mcp-aurelien:latest"
      ]
    }
  }
}
```

**For local npm installation:**

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "/absolute/path/to/n8n-mcp-aurelien/dist/index.js"
      ],
      "env": {
        "N8N_API_URL": "https://your-n8n.hostinger.com",
        "N8N_API_KEY": "your_api_key"
      }
    }
  }
}
```

Restart Claude Desktop after configuration.

## 🛠️ Available Tools

Once configured, Claude can use these tools:

### Workflow Management

- **`create-workflow`**: Create workflows from natural language
  ```
  "Create a workflow that sends me an email every Monday at 9am"
  ```

- **`list-workflows`**: List all workflows (with filters)
  ```
  "Show me all my active workflows"
  ```

- **`get-workflow`**: Get workflow details
  ```
  "Show me the details of workflow abc123"
  ```

- **`update-workflow`**: Modify existing workflows
  ```
  "Change the workflow to send emails at 10am instead"
  ```

- **`delete-workflow`**: Delete workflows
  ```
  "Delete workflow abc123" (requires confirmation)
  ```

- **`execute-workflow`**: Trigger workflow execution
  ```
  "Execute the 'Email Reminder' workflow"
  ```

### Node Explorer

- **`search-nodes`**: Find n8n nodes
  ```
  "What nodes are available for Google Sheets?"
  ```

- **`get-node-documentation`**: Get detailed node info
  ```
  "Show me documentation for the Gmail node"
  ```

- **`list-node-categories`**: List all node categories
  ```
  "What categories of nodes are available?"
  ```

### Template Search

- **`search-templates`**: Find workflow templates
  ```
  "Find templates for Slack automation"
  ```

- **`get-template`**: Get full template JSON
  ```
  "Show me template #42"
  ```

- **`get-database-stats`**: Database statistics
  ```
  "How many nodes and templates are in the database?"
  ```

## 💡 Usage Examples

### Example 1: Create a Simple Workflow

**You:** "Create a workflow that sends me an email reminder every Monday morning at 9am"

**Claude (using MCP):**
1. Calls `create-workflow` with your description
2. Searches database for similar templates
3. Finds relevant nodes (Schedule, Gmail)
4. Creates the workflow in your n8n instance
5. Returns workflow ID and URL

### Example 2: Explore Available Integrations

**You:** "What nodes can I use to integrate with Notion?"

**Claude:**
1. Calls `search-nodes` with query "notion"
2. Returns Notion node details and capabilities

### Example 3: Use a Template

**You:** "Find me a template for logging Slack messages to Google Sheets"

**Claude:**
1. Calls `search-templates` with your query
2. Shows matching templates
3. You can then ask Claude to create a workflow from that template

## 🏗️ Project Structure

```
n8n-mcp-aurelien/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server
│   ├── types/                # TypeScript types
│   ├── database/             # SQLite database
│   │   ├── db.ts            # Database client
│   │   └── schema.sql       # DB schema
│   ├── n8n-api/             # n8n API client
│   │   └── client.ts
│   └── tools/                # MCP tools
│       ├── workflow-creator.ts
│       ├── workflow-manager.ts
│       ├── node-explorer.ts
│       └── template-search.ts
├── scripts/                  # Utility scripts
│   ├── fetch-nodes.ts       # Fetch node data
│   └── init-db.ts           # Initialize database
├── docker/                   # Docker configuration
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── healthcheck.sh
├── data/                     # Database storage
│   └── nodes.db             # SQLite database
└── dist/                     # Compiled TypeScript
```

## 🔧 Development

### Run in Development Mode

```bash
npm run dev
```

This uses `tsx` to watch for changes and restart automatically.

### Build

```bash
npm run build
```

### Database Management

```bash
# Reinitialize database (warning: deletes existing data)
rm data/nodes.db
npm run db:init
```

## 🐛 Troubleshooting

### "Failed to connect to n8n API"

- Check your `N8N_API_URL` and `N8N_API_KEY`
- Ensure your n8n instance is accessible
- Verify API key has proper permissions

### "Database file not found"

```bash
npm run db:init
```

### Claude Desktop not seeing the server

1. Check the config file path is correct
2. Ensure the command/args are valid
3. Restart Claude Desktop completely
4. Check logs in Claude Desktop → Settings → Developer

### Docker container exits immediately

- Check logs: `docker logs n8n-mcp-aurelien`
- Verify environment variables are set
- Ensure database is initialized in the volume

## 📊 Database Schema

The SQLite database contains:

- **nodes table**: 541 n8n nodes with full metadata
- **templates table**: 2700+ workflow templates
- **Full-text search** enabled on both tables for fast queries

## 🔒 Security Notes

- **Never commit** your `.env` file or API keys
- Use environment variables for all sensitive data
- Run Docker containers as non-root user (already configured)
- Regularly update dependencies

## 🤝 Contributing

This is a personal project, but feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for your own needs.

## 🙏 Acknowledgments

- **n8n** for the amazing workflow automation platform
- **Anthropic** for Claude and the MCP protocol
- **czlonkowski/n8n-mcp** for inspiration and reference

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Review the [MCP documentation](https://docs.anthropic.com/claude/docs/model-context-protocol)
- Check [n8n API docs](https://docs.n8n.io/api/)

---

Built with ❤️ by Aurélien Fagioli
