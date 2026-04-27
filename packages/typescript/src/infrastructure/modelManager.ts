import axios from 'axios';

export class ModelManager {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data.models.map((m: any) => m.name);
    } catch (error) {
      throw new Error('Failed to fetch models from Ollama.');
    }
  }

  async ensureModel(modelName: string): Promise<void> {
    const models = await this.listModels();
    if (!models.includes(modelName) && !models.includes(`${modelName}:latest`)) {
      console.log(`Model ${modelName} not found locally. Attempting to pull...`);
      await this.pullModel(modelName);
    }
  }

  private async pullModel(modelName: string): Promise<void> {
    try {
      // In a real implementation, you'd handle the streaming response to show progress
      await axios.post(`${this.baseUrl}/api/pull`, { name: modelName });
      console.log(`Successfully pulled model ${modelName}.`);
    } catch (error) {
      throw new Error(`Failed to pull model ${modelName}.`);
    }
  }
}
