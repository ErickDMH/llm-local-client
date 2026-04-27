import { Context } from '../../src/context/Context';

describe('Context System', () => {
  let context: Context;

  beforeEach(() => {
    context = new Context();
  });

  test('should create a root node', () => {
    const node = context.addNode('user', 'Hello');
    expect(node.role).toBe('user');
    expect(node.content).toBe('Hello');
    expect(node.parentId).toBeNull();
  });

  test('should create a child node and link correctly', () => {
    const root = context.addNode('user', 'Hello');
    const child = context.addNode('assistant', 'Hi there', root.id);

    expect(child.parentId).toBe(root.id);
    expect(root.childrenIds).toContain(child.id);
  });

  test('should retrieve full context path', () => {
    const n1 = context.addNode('user', 'A');
    const n2 = context.addNode('assistant', 'B', n1.id);
    const n3 = context.addNode('user', 'C', n2.id);

    const fullPath = context.getFullContext(n3.id);
    expect(fullPath.length).toBe(3);
    expect(fullPath[0].content).toBe('A');
    expect(fullPath[2].content).toBe('C');
  });

  test('should branch conversations', () => {
    const root = context.addNode('user', 'What is 2+2?');
    const branch1 = context.addNode('assistant', '4', root.id);
    const branch2 = context.addNode('assistant', 'Four', root.id);

    const branches = context.getConversationBranches();
    expect(branches.length).toBe(2);
    expect(branches[0][1]).toBe(branch1.id);
    expect(branches[1][1]).toBe(branch2.id);
  });
});
