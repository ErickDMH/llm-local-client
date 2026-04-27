import pytest
from llm_local_client.context.context import Context

def test_create_root_node():
    context = Context()
    node = context.add_node('user', 'Hello')
    assert node.role == 'user'
    assert node.content == 'Hello'
    assert node.parent_id is None

def test_create_child_node_and_link():
    context = Context()
    root = context.add_node('user', 'Hello')
    child = context.add_node('assistant', 'Hi there', parent_id=root.id)
    
    assert child.parent_id == root.id
    assert child.id in root.children_ids

def test_retrieve_full_context_path():
    context = Context()
    n1 = context.add_node('user', 'A')
    n2 = context.add_node('assistant', 'B', n1.id)
    n3 = context.add_node('user', 'C', n2.id)

    full_path = context.get_full_context(n3.id)
    assert len(full_path) == 3
    assert full_path[0].content == 'A'
    assert full_path[-1].content == 'C'

def test_branch_conversations():
    context = Context()
    root = context.add_node('user', 'What is 2+2?')
    branch1 = context.add_node('assistant', '4', root.id)
    branch2 = context.add_node('assistant', 'Four', root.id)

    branches = context.get_conversation_branches()
    assert len(branches) == 2
    assert branch1.id in [b[-1] for b in branches]
    assert branch2.id in [b[-1] for b in branches]
