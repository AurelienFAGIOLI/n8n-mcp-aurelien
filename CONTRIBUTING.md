# Contributing to n8n MCP Server

First off, thank you for considering contributing to n8n MCP Server! 🎉

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [Documentation Style Guide](#documentation-style-guide)
- [Additional Notes](#additional-notes)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

- Be respectful and inclusive
- Be patient and welcoming
- Focus on what is best for the community
- Show empathy towards other community members

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible.

**How to Submit a Good Bug Report:**

1. **Use a clear and descriptive title** for the issue
2. **Describe the exact steps to reproduce the problem**
3. **Provide specific examples** to demonstrate the steps
4. **Describe the behavior you observed** after following the steps
5. **Explain which behavior you expected** to see instead and why
6. **Include screenshots** if possible
7. **Include your environment details**:
   - n8n MCP Server version
   - Node.js version
   - Operating system
   - Docker version (if applicable)
   - n8n version

**Example Bug Report:**

```markdown
## Bug Description
Claude Desktop fails to connect to MCP server on macOS

## Steps to Reproduce
1. Install n8n MCP server with Docker
2. Configure Claude Desktop with provided config
3. Restart Claude Desktop
4. Server doesn't appear in tools list

## Expected Behavior
MCP server should be available in Claude's tool list

## Actual Behavior
No MCP tools visible, no error messages

## Environment
- n8n MCP Server: v1.0.0
- Node.js: v20.10.0
- OS: macOS 14.2
- Docker: 24.0.7
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List some examples** of how it would work
- **Specify if this is related to a problem** you're having

**Example Enhancement:**

```markdown
## Enhancement: Add workflow template categories

**Problem**: Currently hard to find specific template types among 2700+ templates

**Proposed Solution**: Add category filtering to search-templates tool
- Categories: Marketing, Development, HR, Sales, etc.
- Filter parameter: `category: "Marketing"`

**Benefits**:
- Faster template discovery
- Better user experience
- More organized template library

**Examples**:
```typescript
// Search only marketing templates
await searchTemplates({
  query: "email",
  category: "Marketing"
});
```
```

### Your First Code Contribution

Unsure where to begin? You can start by looking through these `good-first-issue` and `help-wanted` issues:

- **Good first issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which are a bit more involved

### Pull Requests

The process described here has several goals:

- Maintain code quality
- Fix problems that are important to users
- Engage the community in working toward the best possible n8n MCP Server
- Enable a sustainable system for maintainers to review contributions

**Please follow these steps:**

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** with clear, commented code
3. **Add tests** if you're adding functionality
4. **Update documentation** if you changed APIs
5. **Ensure the test suite passes**: `npm test`
6. **Make sure your code lints**: `npm run lint`
7. **Write a good commit message** (see style guide below)
8. **Push to your fork** and submit a pull request

**Pull Request Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work)
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- Docker (optional, for testing containers)
- Git
- A code editor (VSCode recommended)

### Setup Steps

1. **Fork and clone the repository**

```bash
git clone https://github.com/aurelienfagioli/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**

```bash
cp .env.example .env
# Edit .env with your n8n credentials
```

4. **Initialize the database**

```bash
npm run db:init
```

5. **Build the project**

```bash
npm run build
```

6. **Run in development mode**

```bash
npm run dev
```

### Project Structure

```
src/
├── index.ts              # Entry point
├── server.ts             # MCP server setup
├── types/                # TypeScript type definitions
├── database/             # SQLite database layer
├── n8n-api/              # n8n REST API client
└── tools/                # MCP tool implementations
    ├── workflow-creator.ts
    ├── workflow-manager.ts
    ├── node-explorer.ts
    └── template-search.ts
```

---

## Style Guides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (white-space, formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**

```bash
feat(workflow-creator): add template category filtering

Adds ability to filter templates by category in search-templates tool.
This helps users find relevant templates faster.

Closes #42

---

fix(database): correct AI nodes count query

The query was returning an object instead of number.
Changed to extract .count property correctly.

---

docs(readme): update installation instructions

Added Docker Hub pull instructions and improved
troubleshooting section.
```

**Rules:**

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

**General Principles:**

- Write clear, self-documenting code
- Prefer readability over cleverness
- Use TypeScript features for type safety
- Follow existing code patterns in the project

**Formatting:**

```typescript
// ✅ Good
export interface WorkflowInput {
  name: string;
  description: string;
  active?: boolean;
}

export async function createWorkflow(
  input: WorkflowInput
): Promise<WorkflowOutput> {
  try {
    const workflow = await n8nClient.createWorkflow(input);
    return {
      success: true,
      workflowId: workflow.id
    };
  } catch (error) {
    logger.error('Failed to create workflow:', error);
    throw error;
  }
}

// ❌ Avoid
export interface WorkflowInput{name:string;description:string;active?:boolean;}
export async function createWorkflow(input:WorkflowInput):Promise<WorkflowOutput>{try{const workflow=await n8nClient.createWorkflow(input);return {success:true,workflowId:workflow.id};}catch(error){logger.error('Failed',error);throw error;}}
```

**Naming Conventions:**

```typescript
// Interfaces: PascalCase
interface WorkflowConfig {}

// Functions: camelCase
function createWorkflow() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;

// Private methods: prefix with _
class MyClass {
  private _internalMethod() {}
}
```

**Async/Await:**

```typescript
// ✅ Use async/await
async function fetchData() {
  try {
    const result = await api.get('/data');
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ Avoid promise chains when async/await is clearer
function fetchData() {
  return api.get('/data')
    .then(result => result)
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}
```

**Error Handling:**

```typescript
// ✅ Always handle errors explicitly
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  const errorMessage = error instanceof Error
    ? error.message
    : 'Unknown error';
  return { success: false, error: errorMessage };
}
```

### Documentation Style Guide

**Code Comments:**

```typescript
/**
 * Create a new n8n workflow from a natural language description
 *
 * @param input - Workflow description and configuration
 * @returns Created workflow details including ID and URL
 * @throws {Error} If n8n API is unreachable or returns an error
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflow({
 *   description: "Send email every Monday at 9am",
 *   name: "Weekly Email Reminder"
 * });
 * console.log(workflow.workflowUrl);
 * ```
 */
export async function createWorkflow(
  input: CreateWorkflowInput
): Promise<CreateWorkflowOutput> {
  // Implementation
}
```

**README Updates:**

- Keep language clear and concise
- Use headings hierarchically (H1 -> H2 -> H3)
- Include code examples for new features
- Update table of contents if adding new sections
- Use emoji sparingly and consistently

---

## Additional Notes

### Issue and Pull Request Labels

Labels help us track and manage issues and pull requests:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on
- `duplicate`: This issue or PR already exists
- `invalid`: This doesn't seem right

### Development Tips

**Testing Locally:**

```bash
# Run type checking
npm run type-check

# Build and test
npm run build
npm test

# Test with Docker
docker build -t n8n-mcp-test .
docker run -it --rm n8n-mcp-test
```

**Debugging:**

```typescript
// Use debug logging
console.debug('Workflow data:', workflow);

// Enable verbose logging in .env
LOG_LEVEL=debug
```

**Database Changes:**

If you modify the database schema:

1. Update `src/database/schema.sql`
2. Update the migration logic in `scripts/init-db.ts`
3. Test with a fresh database: `rm data/nodes.db && npm run db:init`
4. Document the changes in your PR

### Getting Help

- 💬 Join discussions in GitHub Discussions
- 📧 Contact maintainers via email (see README)
- 📖 Read the full documentation in `/docs`
- 🐛 Check existing issues before creating new ones

---

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for their specific contributions
- GitHub's contributors page

Thank you for contributing! 🎉

---

Built with ❤️ by the community
