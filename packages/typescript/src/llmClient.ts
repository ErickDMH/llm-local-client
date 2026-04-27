import axios from 'axios';
import { Context } from './context/Context';
import { ContextNode } from './context/ContextNode';
import { ModelManager } from './infrastructure/modelManager';
import { checkOllamaStatus } from './infrastructure/infraCheck';
import { Utils } from './utils/Utils';

export interface LLMClientOptions {
  model: string;
  baseUrl?: string;
}

export interface PromptOptions {
  message: string;
  contextId?: string;
  images?: string[];
  temperature?: number;
}

export class LLMClient {
  private model: string;
  private baseUrl: string;
  private contextManager: Context;
  private modelManager: ModelManager;
  public utils: Utils;

  constructor(options: LLMClientOptions) {
    this.model = options.model;
    this.baseUrl = options.baseUrl || 'http://localhost:11434';
    this.contextManager = new Context();
    this.modelManager = new ModelManager(this.baseUrl);
    this.utils = new Utils(this);
  }

  async initialize(): Promise<void> {
    const isRunning = await checkOllamaStatus(this.baseUrl);
    if (!isRunning) {
      throw new Error(`Ollama runtime not detected at ${this.baseUrl}. Please run 'make initial'.`);
    }
    await this.modelManager.ensureModel(this.model);
  }

  async prompt(options: PromptOptions): Promise<string> {
    const { message, contextId, images, temperature } = options;

    // 1. Record user message in context tree
    const userNode = this.contextManager.addNode('user', message, contextId || null);

    // 2. Fetch full history for this branch
    const fullContext = this.contextManager.getFullContext(userNode.id);
    const messages = fullContext.map(node => {
      const msg: any = { role: node.role, content: node.content };
      if (node.id === userNode.id && images && images.length > 0) {
        msg.images = images;
      }
      return msg;
    });

    // 3. Call LLM
    try {
      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: temperature
        }
      });

      const responseContent = response.data.message.content;

      // 4. Record assistant message
      this.contextManager.addNode('assistant', responseContent, userNode.id);

      return responseContent;
    } catch (error: any) {
      throw new Error(`Failed to prompt LLM: ${error.message}`);
    }
  }

  getContext(): Context {
    return this.contextManager;
  }
}
