import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

class Resource:
    def __init__(self, id: str, type: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        self.id = id
        self.type = type
        self.content = content
        self.metadata = metadata or {}

class ContextNode:
    def __init__(self, role: str, content: str, parent_id: Optional[str] = None, resources: Optional[List[Resource]] = None, id: Optional[str] = None):
        self.id = id or str(uuid.uuid4())
        self.role = role
        self.content = content
        self.parent_id = parent_id
        self.resources = resources or []
        self.children_ids: List[str] = []
        self.timestamp = datetime.utcnow()

    def add_child(self, child_id: str):
        if child_id not in self.children_ids:
            self.children_ids.append(child_id)
