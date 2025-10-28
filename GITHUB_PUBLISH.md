# 📤 Guide Complet : Publier sur GitHub & Docker Hub

Ce guide vous explique **étape par étape** comment publier votre projet n8n MCP Server sur GitHub et Docker Hub pour permettre à tout le monde de l'utiliser facilement.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Partie 1 : Publier sur GitHub](#partie-1--publier-sur-github)
3. [Partie 2 : Publier sur Docker Hub](#partie-2--publier-sur-docker-hub)
4. [Partie 3 : Configuration Post-Publication](#partie-3--configuration-post-publication)
5. [Partie 4 : Utilisation par les Autres](#partie-4--utilisation-par-les-autres)

---

## Prérequis

Assurez-vous d'avoir :

- ✅ Un compte GitHub ([S'inscrire](https://github.com/signup))
- ✅ Un compte Docker Hub ([S'inscrire](https://hub.docker.com/signup))
- ✅ Git installé localement
- ✅ Docker Desktop installé et en cours d'exécution
- ✅ Le code compilé sans erreur (`npm run build`)
- ✅ Tous les fichiers committés localement

---

## Partie 1 : Publier sur GitHub

### Étape 1.1 : Créer le Repository GitHub

1. **Ouvrez** : https://github.com/new

2. **Remplissez** le formulaire :
   ```
   Repository name: n8n-mcp-aurelien
   Description: 🤖 Model Context Protocol server for n8n automation with AI-powered workflow creation
   Visibility: ○ Public  ○ Private (votre choix)
   ```

3. **⚠️ IMPORTANT** : NE cochez RIEN d'autre :
   - ❌ PAS de "Add a README file"
   - ❌ PAS de ".gitignore"
   - ❌ PAS de "Choose a license"

   (On les a déjà !)

4. **Cliquez** sur "Create repository"

### Étape 1.2 : Connecter votre Projet Local à GitHub

Une fois le repository créé, GitHub vous montre des commandes. **IGNOREZ-LES** et utilisez celles-ci :

```bash
# 1. Vérifier que vous êtes dans le bon dossier
cd /Users/aurelienfagioli/Documents/dev/FirstClaude/n8n-mcp-aurelien
pwd  # Devrait afficher le chemin ci-dessus

# 2. Ajouter le remote GitHub
# ⚠️ REMPLACEZ "YOUR_USERNAME" par votre nom d'utilisateur GitHub !
git remote add origin https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git

# 3. Vérifier que c'est correct
git remote -v
# Devrait afficher :
# origin  https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git (fetch)
# origin  https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git (push)

# 4. S'assurer qu'on est sur la branche main
git branch -M main

# 5. Pousser le code sur GitHub 🚀
git push -u origin main
```

### Étape 1.3 : Vérifier sur GitHub

1. Rafraîchissez la page GitHub de votre repository
2. Vous devriez voir tous vos fichiers :
   - ✅ README.md
   - ✅ src/, docker/, scripts/
   - ✅ package.json, tsconfig.json
   - ✅ LICENSE, CONTRIBUTING.md, etc.

### Étape 1.4 : Personnaliser le Repository

1. **Allez sur** : https://github.com/YOUR_USERNAME/n8n-mcp-aurelien

2. **Cliquez sur** l'icône ⚙️ (Settings) dans le coin supérieur droit

3. **Dans "About"** (en haut à droite) :
   - Description : `🤖 AI-powered n8n workflow automation for Claude`
   - Website : (laissez vide pour l'instant)
   - Topics : `n8n`, `mcp`, `claude`, `ai`, `automation`, `typescript`, `docker`
   - Cochez ✅ "Use GitHub Pages"

4. **Sauvegardez**

---

## Partie 2 : Publier sur Docker Hub

### Étape 2.1 : Créer un Compte Docker Hub

Si vous n'en avez pas :

1. Allez sur https://hub.docker.com/signup
2. Créez un compte (gratuit)
3. Vérifiez votre email

### Étape 2.2 : Créer un Repository Docker Hub

1. **Allez sur** : https://hub.docker.com/repositories

2. **Cliquez** sur "Create Repository"

3. **Remplissez** :
   ```
   Name: n8n-mcp-aurelien
   Description: Model Context Protocol server for n8n automation
   Visibility: ○ Public  ○ Private
   ```

4. **Cliquez** sur "Create"

### Étape 2.3 : Se Connecter à Docker Hub depuis le Terminal

```bash
# Login à Docker Hub
docker login

# Entrez vos identifiants Docker Hub
# Username: YOUR_DOCKERHUB_USERNAME
# Password: (ou Access Token - voir ci-dessous)
```

**🔒 Utiliser un Access Token (Recommandé) :**

1. Allez sur https://hub.docker.com/settings/security
2. Cliquez "New Access Token"
3. Name : `n8n-mcp-publish`
4. Permissions : Read, Write, Delete
5. Générez et copiez le token
6. Utilisez-le comme mot de passe lors du `docker login`

### Étape 2.4 : Builder et Publier l'Image Docker

```bash
# 1. Vérifier que vous êtes dans le bon dossier
cd /Users/aurelienfagioli/Documents/dev/FirstClaude/n8n-mcp-aurelien

# 2. Builder l'image
# ⚠️ REMPLACEZ "YOUR_DOCKERHUB_USERNAME" par votre nom d'utilisateur Docker Hub !
docker build -t YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest -f docker/Dockerfile .

# 3. Tagger avec la version (depuis package.json)
docker tag YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest \
           YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.0.0

# 4. Pousser sur Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest
docker push YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.0.0

# ✅ C'est fait ! Votre image est publique sur Docker Hub !
```

### Étape 2.5 : Vérifier sur Docker Hub

1. Allez sur https://hub.docker.com/r/YOUR_USERNAME/n8n-mcp-aurelien
2. Vous devriez voir :
   - Tag `latest`
   - Tag `v1.0.0`
   - L'image devrait faire ~200-300 MB

### Étape 2.6 : (Optionnel) Builder pour Multi-Architecture

Si vous voulez que votre image fonctionne sur Intel ET Apple Silicon :

```bash
# 1. Créer un builder multi-arch
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap

# 2. Builder et pousser pour amd64 + arm64
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest \
  --tag YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.0.0 \
  --file docker/Dockerfile \
  --push \
  .

# ✅ Votre image fonctionne maintenant sur tous les processeurs !
```

---

## Partie 3 : Configuration Post-Publication

### Étape 3.1 : Créer une Release GitHub

1. **Allez sur** : https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/releases

2. **Cliquez** sur "Draft a new release"

3. **Remplissez** :
   ```
   Choose a tag: v1.0.0 (create new tag)
   Release title: v1.0.0 - Initial Release
   ```

4. **Description** (copiez-collez) :
   ```markdown
   ## 🎉 Initial Release

   First stable release of n8n MCP Server!

   ### ✨ Features
   - 🤖 AI-powered workflow creation from natural language
   - 📦 2700+ pre-built workflow templates
   - 🔍 Search 541 n8n nodes with documentation
   - ⚙️ Full workflow CRUD operations
   - 🐳 Docker support with multi-architecture builds

   ### 📦 Quick Install

   **Docker (Recommended):**
   ```bash
   docker pull YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.0.0

   docker run -i --rm \
     -e N8N_API_URL="https://your-n8n.com" \
     -e N8N_API_KEY="your_key" \
     -v n8n-mcp-data:/app/data \
     YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.0.0
   ```

   **From Source:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git
   cd n8n-mcp-aurelien
   npm install && npm run build && npm run db:init
   ```

   ### 📖 Documentation
   - [Installation Guide](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/blob/main/INSTALL.md)
   - [Quick Start](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/blob/main/QUICKSTART.md)
   - [Full README](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/blob/main/README.md)

   ### 🙏 Acknowledgments
   Built with ❤️ using [Claude Code](https://claude.com/code)

   Special thanks to:
   - [n8n](https://n8n.io/) for the amazing automation platform
   - [Anthropic](https://anthropic.com/) for Claude and MCP
   - [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) for inspiration
   ```

5. **Cliquez** sur "Publish release"

### Étape 3.2 : Mettre à Jour le README avec vos URLs

Maintenant que tout est publié, mettez à jour les liens dans le README :

```bash
# Ouvrir le README
nano README.md

# Remplacez TOUTES les occurrences de :
# YOUR_USERNAME → votre vrai nom d'utilisateur GitHub
# YOUR_DOCKERHUB_USERNAME → votre vrai nom d'utilisateur Docker Hub

# Par exemple avec sed :
sed -i '' 's/YOUR_USERNAME/aurelienfagioli/g' README.md INSTALL.md CHANGELOG.md DEPLOYMENT.md

# Commitez les changements
git add .
git commit -m "docs: update URLs with real usernames"
git push origin main
```

---

## Partie 4 : Utilisation par les Autres

Une fois publié, **n'importe qui** peut utiliser votre MCP !

### Pour les Utilisateurs : Installation Rapide

Ils peuvent maintenant faire :

**Option 1 : Docker Pull (Le Plus Simple)**

```bash
# Tirer l'image
docker pull YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest

# Configurer Claude Desktop
# Fichier : ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "n8n": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "N8N_API_URL=https://your-n8n.com",
        "-e", "N8N_API_KEY=your_key",
        "-v", "n8n-mcp-data:/app/data",
        "YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest"
      ]
    }
  }
}

# Redémarrer Claude Desktop
# ✅ C'est tout ! Ça fonctionne !
```

**Option 2 : Cloner depuis GitHub**

```bash
git clone https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
npm install
npm run build
npm run db:init

# Puis configurer Claude Desktop avec le chemin local
```

---

## ✅ Checklist Finale

Avant d'annoncer votre projet :

- [ ] ✅ Code pushé sur GitHub
- [ ] ✅ Image Docker publiée sur Docker Hub
- [ ] ✅ Release GitHub créée (v1.0.0)
- [ ] ✅ README mis à jour avec les vrais noms d'utilisateur
- [ ] ✅ Topics ajoutés au repository GitHub
- [ ] ✅ Description Docker Hub remplie
- [ ] ✅ Testé l'installation depuis Docker Hub
- [ ] ✅ Testé le clone depuis GitHub

---

## 🎉 Annoncer votre Projet

Une fois tout publié, vous pouvez partager :

### Sur GitHub

Créez un fichier `ANNOUNCEMENT.md` :

```markdown
# 🚀 Announcing n8n MCP Server v1.0.0

I'm excited to share my latest project: **n8n MCP Server**!

🤖 Create n8n workflows with natural language using Claude
📦 Access 2700+ pre-built templates instantly
🔍 Search 541 n8n nodes with full documentation
🐳 One-command Docker installation

Try it out:
```bash
docker pull YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest
```

Full docs: https://github.com/YOUR_USERNAME/n8n-mcp-aurelien

Feedback welcome! ⭐
```

### Sur Twitter/X

```
🚀 Just launched n8n MCP Server v1.0.0!

Create n8n workflows with natural language in @AnthropicAI Claude 🤖

✨ 2700+ templates
🔍 541 nodes
🐳 Docker ready

Try it: https://github.com/YOUR_USERNAME/n8n-mcp-aurelien

#n8n #AI #Automation #MCP
```

### Sur Reddit

Subreddits pertinents :
- r/n8n
- r/automation
- r/selfhosted
- r/docker

### Sur Discord

- n8n Discord server
- Model Context Protocol Discord

---

## 🔄 Mises à Jour Futures

Quand vous faites des changements :

```bash
# 1. Faites vos modifications
git add .
git commit -m "feat: add new feature"

# 2. Mettez à jour la version
npm version minor  # ou patch, ou major

# 3. Pushez avec tags
git push origin main --tags

# 4. Rebuilder et republier Docker
docker build -t YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest .
docker tag YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest \
           YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.1.0
docker push YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest
docker push YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:v1.1.0

# 5. Créer une nouvelle release sur GitHub
```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. 📖 Consultez [TROUBLESHOOTING.md](README.md#-troubleshooting)
2. 🐛 Ouvrez une [issue GitHub](https://github.com/YOUR_USERNAME/n8n-mcp-aurelien/issues)
3. 💬 Demandez de l'aide sur Discord

---

## 🎯 Résumé des Commandes Importantes

```bash
# Publier sur GitHub
git remote add origin https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git
git branch -M main
git push -u origin main

# Publier sur Docker Hub
docker login
docker build -t YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest -f docker/Dockerfile .
docker push YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest

# Vérifier que tout fonctionne
docker pull YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest
docker run -i --rm YOUR_DOCKERHUB_USERNAME/n8n-mcp-aurelien:latest
```

---

**🎉 Félicitations ! Votre projet est maintenant public et utilisable par le monde entier ! 🌍**

---

Built with ❤️ by Aurélien Fagioli
