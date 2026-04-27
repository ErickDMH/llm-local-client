import { LLMClient } from '../../src/llmClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LLMClient', () => {
  let client: LLMClient;

  beforeEach(() => {
    client = new LLMClient({ model: 'llama3', baseUrl: 'http://localhost:11434' });
  });

  test('should initialize and check status', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { models: [{ name: 'llama3:latest' }] } }); // check status
    mockedAxios.get.mockResolvedValueOnce({ data: { models: [{ name: 'llama3:latest' }] } }); // list models

    await expect(client.initialize()).resolves.not.toThrow();
  });

  test('should throw error if runtime is down', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    await expect(client.initialize()).rejects.toThrow(/Ollama runtime not detected/);
  });

  test('prompt should call ollama and return response', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { message: { content: 'This is the response' } }
    });

    const response = await client.prompt({ message: 'Hello' });
    expect(response).toBe('This is the response');

    // Verify context tree was updated
    const context = client.getContext();
    const branches = context.getConversationBranches();
    expect(branches.length).toBe(1);
    expect(branches[0].length).toBe(2); // user message, then assistant message
  });
});
