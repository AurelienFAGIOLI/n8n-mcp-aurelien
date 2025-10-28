# 🚀 Deployment Guide

This guide explains how to publish the n8n MCP Server to Docker Hub, enabling one-command installation for users worldwide.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Hub Setup](#docker-hub-setup)
- [Building and Tagging](#building-and-tagging)
- [Publishing to Docker Hub](#publishing-to-docker-hub)
- [Multi-Architecture Builds](#multi-architecture-builds)
- [Automated CI/CD](#automated-cicd)
- [Version Management](#version-management)
- [Testing Published Images](#testing-published-images)

---

## Prerequisites

Before publishing to Docker Hub, ensure you have:

- **Docker Hub Account** ([Sign up](https://hub.docker.com/signup))
- **Docker Desktop** installed and running
- **Git** with the latest code committed
- **Repository owner access** to publish images

---

## Docker Hub Setup

### 1. Create Docker Hub Account

If you don't have one:

1. Go to https://hub.docker.com/signup
2. Create an account
3. Verify your email address

### 2. Create a Repository

1. Go to https://hub.docker.com/repositories
2. Click **"Create Repository"**
3. Fill in details:
   - **Name**: `n8n-mcp-aurelien` (or your preferred name)
   - **Description**: `Model Context Protocol server for n8n automation with AI-powered workflow creation`
   - **Visibility**: Public (recommended) or Private
4. Click **"Create"**

### 3. Login to Docker Hub

```bash
# Login from terminal
docker login

# Enter your Docker Hub username and password
# For security, use an access token instead of password:
# Docker Hub → Account Settings → Security → New Access Token
```

**Using Access Token (Recommended):**

```bash
# Create token at: https://hub.docker.com/settings/security
docker login -u aurelienfagioli

# When prompted for password, paste your access token
# Token example: dckr_pat_abc123xyz...
```

---

## Building and Tagging

### Build for Your Platform

```bash
# Navigate to project root
cd /path/to/n8n-mcp-aurelien

# Build the image
docker build -t aurelienfagioli/n8n-mcp-aurelien:latest -f docker/Dockerfile .

# Build with version tag
docker build -t aurelienfagioli/n8n-mcp-aurelien:v1.0.0 -f docker/Dockerfile .
```

### Tagging Strategy

Follow semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Tag with version
docker tag aurelienfagioli/n8n-mcp-aurelien:latest \
           aurelienfagioli/n8n-mcp-aurelien:v1.0.0

# Tag with major version
docker tag aurelienfagioli/n8n-mcp-aurelien:latest \
           aurelienfagioli/n8n-mcp-aurelien:v1

# Tag with major.minor
docker tag aurelienfagioli/n8n-mcp-aurelien:latest \
           aurelienfagioli/n8n-mcp-aurelien:v1.0

# Verify tags
docker images | grep n8n-mcp-aurelien
```

**Recommended Tags:**

- `latest` - Most recent stable release
- `v1.0.0` - Specific version (full semver)
- `v1.0` - Minor version (allows patch updates)
- `v1` - Major version (allows minor + patch updates)
- `dev` - Development/unstable builds (optional)

---

## Publishing to Docker Hub

### Single Push

```bash
# Push latest tag
docker push aurelienfagioli/n8n-mcp-aurelien:latest

# Push specific version
docker push aurelienfagioli/n8n-mcp-aurelien:v1.0.0
```

### Push All Tags

```bash
# Push all tags at once
docker push aurelienfagioli/n8n-mcp-aurelien --all-tags
```

### Automated Script

Create a `scripts/publish-docker.sh` file:

```bash
#!/bin/bash

# Configuration
DOCKER_USERNAME="aurelienfagioli"
IMAGE_NAME="n8n-mcp-aurelien"
VERSION=$(node -p "require('./package.json').version")

echo "📦 Publishing ${IMAGE_NAME}:v${VERSION} to Docker Hub..."

# Build image
echo "🔨 Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:latest -f docker/Dockerfile . || exit 1

# Tag with version
echo "🏷️  Tagging image..."
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
           ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}

# Extract major.minor
MAJOR=$(echo $VERSION | cut -d. -f1)
MINOR=$(echo $VERSION | cut -d. -f1-2)

docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
           ${DOCKER_USERNAME}/${IMAGE_NAME}:v${MAJOR}
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
           ${DOCKER_USERNAME}/${IMAGE_NAME}:v${MINOR}

# Push all tags
echo "🚀 Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:v${MAJOR}
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:v${MINOR}

echo "✅ Successfully published!"
echo "📝 Users can now pull with:"
echo "   docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
echo "   docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION}"
```

Make it executable and run:

```bash
chmod +x scripts/publish-docker.sh
./scripts/publish-docker.sh
```

---

## Multi-Architecture Builds

Build images that work on both Intel (amd64) and Apple Silicon (arm64):

### Setup Buildx

```bash
# Create a new builder
docker buildx create --name mybuilder --use

# Bootstrap the builder
docker buildx inspect --bootstrap
```

### Build Multi-Arch Image

```bash
# Build and push for multiple architectures
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag aurelienfagioli/n8n-mcp-aurelien:latest \
  --tag aurelienfagioli/n8n-mcp-aurelien:v1.0.0 \
  --file docker/Dockerfile \
  --push \
  .
```

**Supported Platforms:**

- `linux/amd64` - Intel/AMD 64-bit (most servers, Intel Macs)
- `linux/arm64` - ARM 64-bit (Apple Silicon, ARM servers)
- `linux/arm/v7` - ARM 32-bit (Raspberry Pi, etc.)

### Automated Multi-Arch Script

Update `scripts/publish-docker.sh`:

```bash
#!/bin/bash

DOCKER_USERNAME="aurelienfagioli"
IMAGE_NAME="n8n-mcp-aurelien"
VERSION=$(node -p "require('./package.json').version")

echo "📦 Building multi-architecture image..."

# Ensure buildx is set up
docker buildx create --name multiarch --use 2>/dev/null || docker buildx use multiarch
docker buildx inspect --bootstrap

# Build and push
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
  --tag ${DOCKER_USERNAME}/${IMAGE_NAME}:v${VERSION} \
  --file docker/Dockerfile \
  --push \
  .

echo "✅ Published multi-architecture image!"
```

---

## Automated CI/CD

### GitHub Actions

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Publish Docker Image

on:
  push:
    tags:
      - 'v*.*.*'  # Trigger on version tags
  workflow_dispatch:  # Allow manual trigger

env:
  DOCKER_USERNAME: aurelienfagioli
  IMAGE_NAME: n8n-mcp-aurelien

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.DOCKER_USERNAME }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{major}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Update Docker Hub description
        uses: peter-evans/dockerhub-description@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
          repository: ${{ env.DOCKER_USERNAME }}/${{ env.IMAGE_NAME }}
          readme-filepath: ./README.md
```

### Required Secrets

Add to GitHub → Settings → Secrets and variables → Actions:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_TOKEN`: Docker Hub access token

### Trigger Deployment

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically build and publish
```

---

## Version Management

### Semantic Versioning

Follow [SemVer](https://semver.org/):

- **MAJOR** (v2.0.0): Incompatible API changes
- **MINOR** (v1.1.0): New features (backward compatible)
- **PATCH** (v1.0.1): Bug fixes (backward compatible)

### Updating Version

**In `package.json`:**

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

This automatically:
1. Updates `package.json`
2. Creates a git commit
3. Creates a git tag

### Publishing Workflow

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 2. Bump version
npm version minor  # Creates v1.1.0 tag

# 3. Push with tags
git push origin main --tags

# 4. Publish to Docker Hub (if automated)
# GitHub Actions will trigger automatically

# OR manually:
./scripts/publish-docker.sh
```

---

## Testing Published Images

### Test Pull

```bash
# Pull latest
docker pull aurelienfagioli/n8n-mcp-aurelien:latest

# Pull specific version
docker pull aurelienfagioli/n8n-mcp-aurelien:v1.0.0
```

### Test Run

```bash
# Run the pulled image
docker run -i --rm \
  -e N8N_API_URL="https://demo.n8n.io" \
  -e N8N_API_KEY="test_key" \
  -v n8n-mcp-data:/app/data \
  aurelienfagioli/n8n-mcp-aurelien:latest
```

### Verify Multi-Arch

```bash
# Check manifest
docker manifest inspect aurelienfagioli/n8n-mcp-aurelien:latest

# Should show multiple platforms:
# - linux/amd64
# - linux/arm64
```

### Test on Different Platforms

**On Intel Mac / Linux:**

```bash
docker run --platform linux/amd64 \
  aurelienfagioli/n8n-mcp-aurelien:latest
```

**On Apple Silicon Mac:**

```bash
docker run --platform linux/arm64 \
  aurelienfagioli/n8n-mcp-aurelien:latest
```

---

## Post-Publication

### Update Documentation

After publishing to Docker Hub, update:

**README.md:**

```markdown
## 🚀 Quick Start with Docker

```bash
# Pull and run in one command
docker pull aurelienfagioli/n8n-mcp-aurelien:latest

docker run -i --rm \
  -e N8N_API_URL="https://your-n8n.com" \
  -e N8N_API_KEY="your_key" \
  -v n8n-mcp-data:/app/data \
  aurelienfagioli/n8n-mcp-aurelien:latest
```
```

**INSTALL.md - Add Docker Hub section:**

```markdown
### Option 1: Pull from Docker Hub (Easiest)

```bash
# Pull latest version
docker pull aurelienfagioli/n8n-mcp-aurelien:latest

# Run immediately
docker run -i --rm \
  -e N8N_API_URL="https://your-n8n.com" \
  -e N8N_API_KEY="your_key" \
  -v n8n-mcp-data:/app/data \
  aurelienfagioli/n8n-mcp-aurelien:latest
```
```

### Create Release Notes

On GitHub:

1. Go to Releases → Draft a new release
2. Choose tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description:

```markdown
## 🎉 Initial Release

First stable release of n8n MCP Server!

### ✨ Features

- 12 MCP tools for complete n8n automation
- AI-powered workflow creation
- 541 nodes with full documentation
- 2700+ workflow templates
- SQLite FTS5 full-text search
- Docker support with multi-architecture builds

### 📦 Docker Installation

```bash
docker pull aurelienfagioli/n8n-mcp-aurelien:v1.0.0
```

### 📖 Documentation

- [Installation Guide](INSTALL.md)
- [Quick Start](QUICKSTART.md)
- [Full Documentation](README.md)

### 🙏 Acknowledgments

Special thanks to the n8n team and Anthropic for making this possible!
```

5. Attach binaries (optional)
6. Publish release

---

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit fix

# Rebuild and republish
npm version patch
./scripts/publish-docker.sh
```

### Image Cleanup

```bash
# Remove old local images
docker images | grep n8n-mcp | awk '{print $3}' | xargs docker rmi

# Prune unused images
docker image prune -a
```

### Docker Hub Cleanup

Periodically remove old tags from Docker Hub:

1. Go to Docker Hub → Repositories → n8n-mcp-aurelien
2. Click Tags tab
3. Select old/unused tags
4. Delete

Keep:
- `latest`
- Last 3-5 version tags
- Current major/minor tags

---

## Troubleshooting

### Build Fails

```bash
# Clear build cache
docker builder prune -af

# Rebuild without cache
docker build --no-cache -t aurelienfagioli/n8n-mcp-aurelien:latest .
```

### Push Denied

```bash
# Re-login to Docker Hub
docker logout
docker login

# Verify image name matches repository
docker images | grep n8n-mcp
```

### Multi-Arch Issues

```bash
# Remove and recreate builder
docker buildx rm multiarch
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap
```

---

## Best Practices

✅ **Always test locally** before pushing to Docker Hub
✅ **Use semantic versioning** for clear version history
✅ **Tag multiple versions** (latest, major, minor, patch)
✅ **Build multi-architecture images** for wider compatibility
✅ **Automate with CI/CD** to reduce human error
✅ **Update documentation** immediately after publishing
✅ **Create GitHub releases** to match Docker tags
✅ **Monitor image size** - keep it as small as possible
✅ **Test on multiple platforms** before announcing
✅ **Keep Docker Hub description updated** with README

---

## Resources

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [GitHub Actions for Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)
- [Semantic Versioning](https://semver.org/)

---

**Next Steps:**

1. [Publish to Docker Hub](#publishing-to-docker-hub)
2. Update [README.md](README.md) with pull instructions
3. Create GitHub release
4. Announce on social media / forums

---

Built with ❤️ by Aurélien Fagioli
