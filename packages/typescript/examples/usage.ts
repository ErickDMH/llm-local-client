import { LLMClient } from '../src';

async function run() {
  const client = new LLMClient({ model: 'llama3' });
  
  try {
    console.log('Initializing client...');
    await client.initialize();
    console.log('Client initialized.');

    console.log('Sending prompt 1...');
    const response1 = await client.prompt({ message: 'Explain what a DAG is in 1 sentence.' });
    console.log(`Assistant: ${response1}\n`);

    // Get the context of the last interaction to branch from it
    const branches = client.getContext().getConversationBranches();
    const lastNodeId = branches[0][branches[0].length - 1]; // The assistant's response node

    console.log('Sending prompt 2 (follow up)...');
    const response2 = await client.prompt({ 
      contextId: lastNodeId, 
      message: 'Give me a real world example of it.' 
    });
    console.log(`Assistant: ${response2}\n`);

    console.log('Full conversation tree:');
    console.log(JSON.stringify(client.getContext().nodeList(), null, 2));

  } catch (error) {
    console.error('Error during execution:', error);
  }
}

run();
