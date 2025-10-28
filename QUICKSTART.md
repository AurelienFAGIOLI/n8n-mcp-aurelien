# 🚀 Guide de Démarrage Rapide

## Étapes d'Installation

### 1. Configuration de l'API n8n

Avant de commencer, vous avez besoin :
- D'une instance n8n (self-hosted sur Hostinger ou n8n.cloud)
- D'une clé API n8n

**Comment obtenir votre clé API n8n :**

1. Connectez-vous à votre instance n8n
2. Allez dans **Settings** → **API**
3. Créez une nouvelle **API Key**
4. Copiez la clé générée

### 2. Configuration du projet

Modifiez le fichier `.env` :

```env
N8N_API_URL=https://your-actual-n8n.hostinger.com
N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxxxx
```

⚠️ **Important** : Remplacez les valeurs par votre vraie URL et clé !

### 3. Test de la connexion

```bash
# Test rapide (nécessite que votre n8n soit accessible)
node dist/index.js
```

Si la connexion fonctionne, vous verrez :
```
✓ n8n API connection successful
Database stats: 10 nodes, 3 templates, 2 AI nodes
🚀 n8n MCP server running!
```

### 4. Configuration dans Claude Desktop

Éditez le fichier de configuration Claude Desktop :

**macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "/Users/aurelienfagioli/Documents/dev/FirstClaude/n8n-mcp-aurelien/dist/index.js"
      ],
      "env": {
        "N8N_API_URL": "https://your-n8n.hostinger.com",
        "N8N_API_KEY": "your_actual_api_key_here",
        "DATABASE_PATH": "/Users/aurelienfagioli/Documents/dev/FirstClaude/n8n-mcp-aurelien/data/nodes.db",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

⚠️ **Attention** :
- Remplacez le chemin absolu par le vôtre
- Utilisez votre vraie URL n8n et clé API
- Redémarrez Claude Desktop après modification

### 5. Test avec Claude

Une fois Claude Desktop redémarré, testez :

**Vous** : "Liste tous mes workflows n8n"

**Claude** devrait utiliser l'outil `list-workflows` et afficher vos workflows.

**Vous** : "Quels nodes sont disponibles pour Gmail ?"

**Claude** devrait chercher dans la base de données et vous montrer les nodes Gmail.

**Vous** : "Créé un workflow qui m'envoie un email tous les lundis à 9h"

**Claude** devrait utiliser `create-workflow` et créer le workflow dans votre n8n !

## 🐳 Alternative : Utiliser Docker

Si vous préférez Docker :

1. Build l'image :
```bash
npm run docker:build
```

2. Configurez Claude Desktop avec Docker :
```json
{
  "mcpServers": {
    "n8n": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "N8N_API_URL=https://your-n8n.hostinger.com",
        "-e", "N8N_API_KEY=your_key",
        "-v", "n8n-mcp-data:/app/data",
        "n8n-mcp-aurelien:latest"
      ]
    }
  }
}
```

## 🔧 Dépannage

### "Failed to connect to n8n API"

- Vérifiez que votre URL n8n est correcte et accessible
- Vérifiez que votre API key est valide
- Testez la connexion avec curl :
  ```bash
  curl -H "X-N8N-API-KEY: your_key" https://your-n8n.hostinger.com/api/v1/workflows
  ```

### "Database file not found"

```bash
npm run db:init
```

### Claude ne voit pas le serveur

1. Vérifiez que le chemin dans la config est absolu
2. Redémarrez Claude Desktop **complètement** (Quit + relancer)
3. Regardez les logs dans Claude Desktop → Settings → Developer

### Erreurs TypeScript lors du build

C'est normal ! Le code compile quand même grâce à `noEmitOnError: false`. Les warnings TypeScript n'empêchent pas l'exécution.

## 📚 Prochaines Étapes

1. **Enrichir la base de données** : Implémentez le scraping complet des 541 nodes n8n dans `scripts/fetch-nodes.ts`

2. **Ajouter plus de templates** : Créez ou scrapez les 2709 templates officiels n8n

3. **Corriger les types TypeScript** : Ajoutez `[x: string]: unknown` aux interfaces d'output

4. **Améliorer le workflow creator** : Utilisez l'IA pour mieux analyser les descriptions et choisir les nodes

5. **Tests** : Ajoutez des tests unitaires avec Vitest

## 🎯 Exemples d'Utilisation

### Créer un workflow simple
```
"Créé un workflow qui vérifie mes emails Gmail toutes les heures et m'envoie une notification Slack pour les emails importants"
```

### Explorer les intégrations
```
"Montre-moi tous les nodes disponibles pour l'intégration avec Google (Sheets, Drive, Calendar, etc.)"
```

### Modifier un workflow existant
```
"Change le workflow 'Email Reminder' pour qu'il s'exécute à 10h au lieu de 9h"
```

### Exécuter un workflow
```
"Exécute le workflow 'Data Backup' maintenant"
```

---

**Besoin d'aide ?** Consultez le [README.md](README.md) complet ou les [docs n8n](https://docs.n8n.io).
