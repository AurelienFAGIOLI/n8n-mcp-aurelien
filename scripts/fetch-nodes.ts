/**
 * Fetch n8n Nodes
 * Downloads information about all n8n nodes from the official sources
 */

import axios from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface NodeInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon?: string;
  isAiNode?: boolean;
}

async function fetchNodes(): Promise<void> {
  console.log('📥 Fetching n8n nodes information...');

  try {
    // This would fetch from n8n's GitHub or API
    // For now, we'll create a sample dataset
    // In production, you'd scrape from: https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes

    const sampleNodes: NodeInfo[] = [
      {
        name: 'n8n-nodes-base.gmail',
        displayName: 'Gmail',
        description: 'Send and receive emails using Gmail',
        category: 'Communication',
        icon: '📧'
      },
      {
        name: 'n8n-nodes-base.slack',
        displayName: 'Slack',
        description: 'Send messages and interact with Slack',
        category: 'Communication',
        icon: '💬'
      },
      {
        name: 'n8n-nodes-base.googleSheets',
        displayName: 'Google Sheets',
        description: 'Read and write data from Google Sheets',
        category: 'Productivity',
        icon: '📊'
      },
      {
        name: 'n8n-nodes-base.httpRequest',
        displayName: 'HTTP Request',
        description: 'Make HTTP requests to any URL',
        category: 'Core Nodes',
        icon: '🌐'
      },
      {
        name: 'n8n-nodes-base.schedule',
        displayName: 'Schedule Trigger',
        description: 'Trigger workflow on a schedule',
        category: 'Core Nodes',
        icon: '⏰'
      },
      {
        name: 'n8n-nodes-base.manualTrigger',
        displayName: 'Manual Trigger',
        description: 'Manually trigger the workflow',
        category: 'Core Nodes',
        icon: '▶️'
      },
      {
        name: '@n8n/n8n-nodes-langchain.openai',
        displayName: 'OpenAI',
        description: 'Use OpenAI models for text generation, chat, and embeddings',
        category: 'AI',
        icon: '🤖',
        isAiNode: true
      },
      {
        name: '@n8n/n8n-nodes-langchain.chatOpenAi',
        displayName: 'Chat OpenAI',
        description: 'Chat with OpenAI models',
        category: 'AI',
        icon: '💬',
        isAiNode: true
      },
      {
        name: 'n8n-nodes-base.notion',
        displayName: 'Notion',
        description: 'Work with Notion databases and pages',
        category: 'Productivity',
        icon: '📝'
      },
      {
        name: 'n8n-nodes-base.airtable',
        displayName: 'Airtable',
        description: 'Read and write to Airtable',
        category: 'Productivity',
        icon: '📋'
      }
    ];

    // Save to JSON file
    const outputPath = join(process.cwd(), 'data', 'nodes-sample.json');
    writeFileSync(outputPath, JSON.stringify(sampleNodes, null, 2));

    console.log(`✅ Saved ${sampleNodes.length} nodes to ${outputPath}`);
    console.log('\n⚠️  NOTE: This is a sample dataset.');
    console.log('For production, implement scraping from:');
    console.log('- https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes');
    console.log('- https://docs.n8n.io/integrations/');

  } catch (error) {
    console.error('❌ Error fetching nodes:', error);
    process.exit(1);
  }
}

fetchNodes();
