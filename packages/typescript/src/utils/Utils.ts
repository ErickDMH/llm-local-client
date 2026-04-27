import type { LLMClient } from '../llmClient';

export class Utils {
  private client: LLMClient;

  constructor(client: LLMClient) {
    this.client = client;
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
    return await this.client.prompt({ message: prompt });
  }

  async inferLanguage(text: string): Promise<string> {
    const prompt = `Identify the language of the following text. Respond with ONLY the name of the language (e.g., English, Spanish):\n\n${text}`;
    const result = await this.client.prompt({ message: prompt });
    return result.trim();
  }

  async audioToText(audioPath: string): Promise<string> {
    // Stub: This requires an external service or a specific audio model like Whisper.
    throw new Error('audioToText not natively supported by Ollama text models yet. Use a Whisper endpoint.');
  }

  async interpretImage(imagePathBase64: string): Promise<string> {
    // Uses a multimodal model like LLaVA
    return await this.client.prompt({
      message: 'Describe this image in detail.',
      images: [imagePathBase64]
    });
  }
}
