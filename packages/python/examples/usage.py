from llm_local_client import LLMClient
import json

def run():
    client = LLMClient(model='llama3')
    
    try:
        print('Initializing client...')
        client.initialize()
        print('Client initialized.')

        print('Sending prompt 1...')
        response1 = client.prompt(message='Explain what a DAG is in 1 sentence.')
        print(f'Assistant: {response1}\n')

        # Get the context of the last interaction to branch from it
        branches = client.get_context().get_conversation_branches()
        last_node_id = branches[0][-1] # The assistant's response node

        print('Sending prompt 2 (follow up)...')
        response2 = client.prompt(
            message='Give me a real world example of it.',
            context_id=last_node_id
        )
        print(f'Assistant: {response2}\n')

        print('Full conversation tree:')
        nodes = [{"id": n.id, "role": n.role, "content": n.content} for n in client.get_context().node_list()]
        print(json.dumps(nodes, indent=2))

    except Exception as e:
        print(f'Error during execution: {e}')

if __name__ == '__main__':
    run()
