import json
import base64
from typing import List, Optional, Dict
from .context_node import ContextNode, Resource

class Context:
    def __init__(self):
        self.nodes: Dict[str, ContextNode] = {}
        self.root_nodes: List[str] = []

    def add_node(self, role: str, content: str, parent_id: Optional[str] = None, resources: Optional[List[Resource]] = None) -> ContextNode:
        node = ContextNode(role=role, content=content, parent_id=parent_id, resources=resources)
        self.nodes[node.id] = node

        if parent_id:
            if parent_id in self.nodes:
                self.nodes[parent_id].add_child(node.id)
            else:
                raise ValueError(f"Parent node {parent_id} not found.")
        else:
            self.root_nodes.append(node.id)

        return node

    def get_node(self, node_id: str) -> Optional[ContextNode]:
        return self.nodes.get(node_id)

    def node_list(self) -> List[ContextNode]:
        return list(self.nodes.values())

    def get_conversation_branches(self) -> List[List[str]]:
        branches = []
        
        def traverse(node_id: str, current_path: List[str]):
            node = self.nodes.get(node_id)
            if not node: return
            
            path = current_path + [node_id]
            if not node.children_ids:
                branches.append(path)
            else:
                for child_id in node.children_ids:
                    traverse(child_id, path)
                    
        for root_id in self.root_nodes:
            traverse(root_id, [])
            
        return branches

    def get_full_context(self, leaf_node_id: str) -> List[ContextNode]:
        context = []
        current_id = leaf_node_id
        
        while current_id:
            node = self.nodes.get(current_id)
            if not node: break
            context.insert(0, node)
            current_id = node.parent_id
            
        return context

    def get_resume(self, leaf_node_id: str) -> str:
        full_context = self.get_full_context(leaf_node_id)
        return f"Summarized conversation of {len(full_context)} messages ending at {leaf_node_id}."

    def get_compress(self, leaf_node_id: str) -> str:
        full_context = self.get_full_context(leaf_node_id)
        data = [{"role": n.role, "content": n.content} for n in full_context]
        return base64.b64encode(json.dumps(data).encode('utf-8')).decode('utf-8')

    def get_all_resources(self, leaf_node_id: str) -> List[Resource]:
        full_context = self.get_full_context(leaf_node_id)
        resources = []
        for node in full_context:
            resources.extend(node.resources)
        return resources

    def upload_resource(self, node_id: str, resource: Resource):
        node = self.nodes.get(node_id)
        if node:
            node.resources.append(resource)
        else:
            raise ValueError(f"Node {node_id} not found.")

    def thread_compare(self, thread_a_id: str, thread_b_id: str) -> str:
        thread_a = self.get_full_context(thread_a_id)
        thread_b = self.get_full_context(thread_b_id)
        return f"Comparison: Thread A has {len(thread_a)} nodes, Thread B has {len(thread_b)} nodes."
