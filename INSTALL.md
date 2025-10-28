# 📦 Installation depuis GitHub

Ce guide explique comment installer et utiliser le serveur n8n MCP depuis GitHub.

## 🚀 Installation Rapide avec Docker (Recommandé)

### Prérequis
- Docker et Docker Compose installés
- Un compte n8n (self-hosted ou n8n.cloud)
- Une clé API n8n ([comment l'obtenir](QUICKSTART.md#1-configuration-de-lapi-n8n))

### Étapes

**1. Cloner le repository**
```bash
git clone https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
```

**2. Configurer les variables d'environnement**
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos credentials
nano .env
```

Modifiez les valeurs :
```env
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your_api_key_here
DATABASE_PATH=/app/data/nodes.db
```

**3. Initialiser la base de données**
```bash
# Installer les dépendances
npm install

# Initialiser la DB avec les nodes d'exemple
npm run db:init
```

**4. Build l'image Docker**
```bash
npm run docker:build
```

**5. Configurer Claude Desktop**

Éditez votre fichier de configuration Claude Desktop :

**macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows** : `%APPDATA%\Claude\claude_desktop_config.json`
**Linux** : `~/.config/Claude/claude_desktop_config.json`

Ajoutez cette configuration :

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
        "n8n-mcp-aurelien:latest"
      ]
    }
  }
}
```

**⚠️ Important** : Remplacez les valeurs `N8N_API_URL` et `N8N_API_KEY` par vos vraies credentials !

**6. Redémarrer Claude Desktop**

Quittez complètement Claude Desktop et relancez-le.

**7. Tester**

Dans Claude, essayez :
```
"Liste mes workflows n8n"
"Créé un workflow qui m'envoie un email tous les lundis"
```

---

## 💻 Installation sans Docker (Node.js)

Si vous préférez utiliser Node.js directement :

**1. Cloner et installer**
```bash
git clone https://github.com/YOUR_USERNAME/n8n-mcp-aurelien.git
cd n8n-mcp-aurelien
npm install
```

**2. Configurer**
```bash
cp .env.example .env
nano .env
```

**3. Compiler et initialiser**
```bash
npm run build
npm run db:init
```

**4. Configuration Claude Desktop**
```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "/chemin/absolu/vers/n8n-mcp-aurelien/dist/index.js"
      ],
      "env": {
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your_api_key",
        "DATABASE_PATH": "/chemin/absolu/vers/n8n-mcp-aurelien/data/nodes.db"
      }
    }
  }
}
```

**5. Redémarrer Claude Desktop**

---

## 🔧 Dépannage

### "Failed to connect to n8n API"
- Vérifiez que votre instance n8n est accessible
- Testez votre API key avec curl :
  ```bash
  curl -H "X-N8N-API-KEY: your_key" \
       https://your-n8n.com/api/v1/workflows
  ```

### "Database not found"
```bash
npm run db:init
```

### Claude ne voit pas le serveur
- Vérifiez que les chemins sont **absolus** (pas de `~` ou `./`)
- Redémarrez Claude **complètement** (Quit + relancer)
- Regardez les logs dans : Claude Desktop → Settings → Developer

### Permission denied sur Docker
```bash
# Linux/macOS : ajoutez votre user au groupe docker
sudo usermod -aG docker $USER
# Puis déconnectez/reconnectez
```

---

## 📚 Documentation

- [README.md](README.md) - Vue d'ensemble complète
- [QUICKSTART.md](QUICKSTART.md) - Guide de démarrage rapide
- [src/tools/](src/tools/) - Code source des outils

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug
- Proposer une pull request pour ajouter des features
- Améliorer la documentation

## 📜 Licence

MIT © Aurélien Fagioli
