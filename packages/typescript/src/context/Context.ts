import { v4 as uuidv4 } from 'uuid';
import { ContextNode, Resource } from './ContextNode';

export class Context {
  private nodes: Map<string, ContextNode>;
  private rootNodes: string[];

  constructor() {
    this.nodes = new Map();
    this.rootNodes = [];
  }

  addNode(role: 'user' | 'assistant' | 'system', content: string, parentId: string | null = null, resources: Resource[] = []): ContextNode {
    const id = uuidv4();
    const node = new ContextNode(id, role, content, parentId, resources);
    
    this.nodes.set(id, node);

    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent) {
        parent.addChild(id);
      } else {
        throw new Error(`Parent node ${parentId} not found.`);
      }
    } else {
      this.rootNodes.push(id);
    }

    return node;
  }

  getNode(nodeId: string): ContextNode | undefined {
    return this.nodes.get(nodeId);
  }

  nodeList(): ContextNode[] {
    return Array.from(this.nodes.values());
  }

  getConversationBranches(): string[][] {
    const branches: string[][] = [];
    
    const traverse = (nodeId: string, currentPath: string[]) => {
      const node = this.nodes.get(nodeId);
      if (!node) return;

      const path = [...currentPath, nodeId];
      if (node.childrenIds.length === 0) {
        branches.push(path);
      } else {
        for (const childId of node.childrenIds) {
          traverse(childId, path);
        }
      }
    };

    for (const rootId of this.rootNodes) {
      traverse(rootId, []);
    }

    return branches;
  }

  getFullContext(leafNodeId: string): ContextNode[] {
    const context: ContextNode[] = [];
    let currentId: string | null = leafNodeId;

    while (currentId) {
      const node = this.nodes.get(currentId);
      if (!node) break;
      context.unshift(node);
      currentId = node.parentId;
    }

    return context;
  }

  getResume(leafNodeId: string): string {
    const fullContext = this.getFullContext(leafNodeId);
    return `Summarized conversation of ${fullContext.length} messages ending at ${leafNodeId}.`;
  }

  getCompress(leafNodeId: string): string {
    const fullContext = this.getFullContext(leafNodeId);
    return Buffer.from(JSON.stringify(fullContext)).toString('base64');
  }

  getAllResources(leafNodeId: string): Resource[] {
    const fullContext = this.getFullContext(leafNodeId);
    return fullContext.flatMap(node => node.resources);
  }

  uploadResource(nodeId: string, resource: Resource): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.resources.push(resource);
    } else {
      throw new Error(`Node ${nodeId} not found.`);
    }
  }

  threadCompare(threadAId: string, threadBId: string): string {
    const threadA = this.getFullContext(threadAId);
    const threadB = this.getFullContext(threadBId);
    
    return `Comparison: Thread A has ${threadA.length} nodes, Thread B has ${threadB.length} nodes.`;
  }
}
