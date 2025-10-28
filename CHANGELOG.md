# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Docker Hub publishing with multi-architecture support
- Advanced template filtering by popularity and rating
- Web UI for browsing nodes and templates
- Comprehensive test suite with Vitest
- Video tutorials and documentation
- Multi-language support

---

## [1.0.0] - 2025-01-XX

### 🎉 Initial Release

First stable release of n8n MCP Server! A complete Model Context Protocol server that enables Claude to create, manage, and execute n8n workflows through natural language.

### Added

#### Core Features
- **AI Workflow Creation**: Create workflows from natural language descriptions
- **Smart Template Search**: Access to 2700+ pre-built workflow templates
- **Node Explorer**: Search and explore 541 n8n nodes with full documentation
- **Full CRUD Operations**: Complete workflow lifecycle management
- **Workflow Execution**: Trigger and monitor workflow runs
- **SQLite Database**: Fast full-text search using FTS5

#### MCP Tools (12 total)

**Workflow Management:**
- `create-workflow` - Create workflows from natural language
- `list-workflows` - List all workflows with optional filters
- `get-workflow` - Get detailed workflow information
- `update-workflow` - Modify existing workflows
- `delete-workflow` - Delete workflows (with confirmation)
- `execute-workflow` - Trigger workflow execution

**Node Explorer:**
- `search-nodes` - Search through 541 n8n nodes
- `get-node-documentation` - Get detailed node documentation
- `list-node-categories` - List all available node categories

**Template Library:**
- `search-templates` - Search 2700+ workflow templates
- `get-template` - Retrieve full template JSON
- `get-database-stats` - Get database statistics

#### Technical Features
- TypeScript with full type safety
- SQLite database with FTS5 full-text search
- Docker support with multi-stage builds
- Zod validation for input/output schemas
- Comprehensive error handling
- Secure by default (non-root container, environment-based secrets)
- n8n API client with Axios
- Stdio transport for Claude Desktop integration

#### Documentation
- Comprehensive README with examples
- QUICKSTART guide for fast setup
- INSTALL guide with multiple installation methods
- CONTRIBUTING guide for developers
- DEPLOYMENT guide for Docker Hub publishing
- Full JSDoc comments in code
- Example configurations for Claude Desktop

#### Development Tools
- Development mode with auto-reload (`npm run dev`)
- Database initialization scripts
- Node and template fetching scripts
- Docker Compose configuration
- Health check scripts
- TypeScript build system

### Technical Details

**Database:**
- 541 n8n nodes with metadata
- 2700+ workflow templates
- Full-text search indexes (FTS5)
- Category-based organization
- AI node identification

**API Integration:**
- Full n8n REST API v1 support
- Workflow CRUD operations
- Execution triggers
- URL generation for workflows
- Error handling with retries

**Docker:**
- Multi-stage build (builder + runtime)
- Alpine Linux base (minimal size)
- Non-root user execution
- Health checks
- Volume support for persistent data
- Environment variable configuration

### Security
- API keys via environment variables only
- No hardcoded credentials
- Git ignore for sensitive files
- Docker non-root user
- HTTPS enforcement for API calls
- Input validation with Zod

### Performance
- SQLite FTS5 for fast searches
- Indexed database queries
- Lazy loading of templates
- Efficient Docker layering
- Minimal dependencies

---

## Version History Format

Each version follows this structure:

### [Version Number] - YYYY-MM-DD

#### Added
- New features and capabilities

#### Changed
- Changes to existing functionality

#### Deprecated
- Features that will be removed in future versions

#### Removed
- Features that have been removed

#### Fixed
- Bug fixes

#### Security
- Security improvements and patches

---

## Versioning Strategy

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New features (backward compatible)
- **PATCH** version (0.0.X): Bug fixes (backward compatible)

---

## Contributing

Found a bug? Have a feature request? See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute.

---

## Links

- [Repository](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien)
- [Docker Hub](https://hub.docker.com/r/YOUR_USERNAME/n8n-mcp-aurelien)
- [Issues](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/issues)
- [Releases](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/releases)

---

[Unreleased]: https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/releases/tag/v1.0.0
