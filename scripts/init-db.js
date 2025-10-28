/**
 * Initialize Database
 * Populates the SQLite database with nodes and templates data
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { N8nDatabase } from '../src/database/db.js';
async function initializeDatabase() {
    console.log('🗄️  Initializing n8n MCP database...\n');
    const dbPath = join(process.cwd(), 'data', 'nodes.db');
    const db = new N8nDatabase(dbPath);
    try {
        // Load and insert nodes
        const nodesPath = join(process.cwd(), 'data', 'nodes-sample.json');
        if (!existsSync(nodesPath)) {
            console.log('⚠️  nodes-sample.json not found. Run `npm run fetch:nodes` first.');
            console.log('Creating database with empty data...');
        }
        else {
            const nodesData = readFileSync(nodesPath, 'utf-8');
            const nodes = JSON.parse(nodesData);
            console.log(`📦 Loading ${nodes.length} nodes...`);
            const dbNodes = nodes.map(node => ({
                id: node.name,
                name: node.name,
                displayName: node.displayName,
                description: node.description,
                category: node.category,
                icon: node.icon,
                documentation: `Documentation for ${node.displayName}`,
                parameters: JSON.stringify({}),
                examples: JSON.stringify([]),
                isAiNode: node.isAiNode || false
            }));
            db.insertNodes(dbNodes);
            console.log(`✅ Inserted ${dbNodes.length} nodes`);
        }
        // Create sample templates
        console.log('\n📋 Creating sample templates...');
        const sampleTemplates = [
            {
                name: 'Weekly Email Reminder',
                description: 'Send automated email reminders every Monday at 9am',
                workflowJson: JSON.stringify({
                    nodes: [
                        {
                            id: 'schedule',
                            name: 'Schedule',
                            type: 'n8n-nodes-base.schedule',
                            typeVersion: 1,
                            position: [250, 300],
                            parameters: {
                                rule: {
                                    interval: [{
                                            field: 'cronExpression',
                                            expression: '0 9 * * 1'
                                        }]
                                }
                            }
                        },
                        {
                            id: 'gmail',
                            name: 'Gmail',
                            type: 'n8n-nodes-base.gmail',
                            typeVersion: 1,
                            position: [450, 300],
                            parameters: {
                                operation: 'send',
                                message: {
                                    to: 'recipient@example.com',
                                    subject: 'Weekly Reminder',
                                    message: 'This is your weekly reminder!'
                                }
                            }
                        }
                    ],
                    connections: {
                        schedule: {
                            main: [[{ node: 'gmail', type: 'main', index: 0 }]]
                        }
                    }
                }),
                nodes: 'n8n-nodes-base.schedule, n8n-nodes-base.gmail',
                category: 'Communication',
                tags: 'email, schedule, reminder'
            },
            {
                name: 'Slack to Google Sheets',
                description: 'Log Slack messages to Google Sheets',
                workflowJson: JSON.stringify({
                    nodes: [
                        {
                            id: 'slack-trigger',
                            name: 'Slack Trigger',
                            type: 'n8n-nodes-base.slackTrigger',
                            typeVersion: 1,
                            position: [250, 300],
                            parameters: {}
                        },
                        {
                            id: 'sheets',
                            name: 'Google Sheets',
                            type: 'n8n-nodes-base.googleSheets',
                            typeVersion: 1,
                            position: [450, 300],
                            parameters: {
                                operation: 'append'
                            }
                        }
                    ],
                    connections: {
                        'slack-trigger': {
                            main: [[{ node: 'sheets', type: 'main', index: 0 }]]
                        }
                    }
                }),
                nodes: 'n8n-nodes-base.slackTrigger, n8n-nodes-base.googleSheets',
                category: 'Productivity',
                tags: 'slack, google sheets, logging'
            },
            {
                name: 'AI Content Summarizer',
                description: 'Use OpenAI to summarize long text content',
                workflowJson: JSON.stringify({
                    nodes: [
                        {
                            id: 'manual',
                            name: 'Manual Trigger',
                            type: 'n8n-nodes-base.manualTrigger',
                            typeVersion: 1,
                            position: [250, 300],
                            parameters: {}
                        },
                        {
                            id: 'openai',
                            name: 'OpenAI',
                            type: '@n8n/n8n-nodes-langchain.openai',
                            typeVersion: 1,
                            position: [450, 300],
                            parameters: {
                                model: 'gpt-4',
                                prompt: 'Summarize the following text: {{$json.text}}'
                            }
                        }
                    ],
                    connections: {
                        manual: {
                            main: [[{ node: 'openai', type: 'main', index: 0 }]]
                        }
                    }
                }),
                nodes: 'n8n-nodes-base.manualTrigger, @n8n/n8n-nodes-langchain.openai',
                category: 'AI',
                tags: 'ai, openai, summarize, gpt'
            }
        ];
        db.insertTemplates(sampleTemplates);
        console.log(`✅ Inserted ${sampleTemplates.length} sample templates`);
        // Show stats
        const stats = db.getStats();
        console.log('\n📊 Database Statistics:');
        console.log(`   Total Nodes: ${stats.totalNodes}`);
        console.log(`   AI Nodes: ${stats.aiNodes.count}`);
        console.log(`   Categories: ${stats.categories}`);
        console.log(`   Templates: ${stats.totalTemplates}`);
        console.log(`\n✅ Database initialized successfully at: ${dbPath}`);
    }
    catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
    finally {
        db.close();
    }
}
initializeDatabase();
//# sourceMappingURL=init-db.js.map