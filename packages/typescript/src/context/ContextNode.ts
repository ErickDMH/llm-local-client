export interface Resource {
  id: string;
  type: string; // 'text', 'image', 'pdf', etc.
  content: string; // path or base64 or raw text
  metadata?: Record<string, any>;
}

export class ContextNode {
  public readonly id: string;
  public readonly parentId: string | null;
  public readonly role: 'user' | 'assistant' | 'system';
  public readonly content: string;
  public readonly resources: Resource[];
  public readonly childrenIds: string[];
  public readonly timestamp: Date;

  constructor(
    id: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    parentId: string | null = null,
    resources: Resource[] = []
  ) {
    this.id = id;
    this.role = role;
    this.content = content;
    this.parentId = parentId;
    this.resources = resources;
    this.childrenIds = [];
    this.timestamp = new Date();
  }

  addChild(childId: string) {
    if (!this.childrenIds.includes(childId)) {
      this.childrenIds.push(childId);
    }
  }
}
