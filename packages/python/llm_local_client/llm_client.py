import requests
from typing import Optional, List, Dict, Any
from .context.context import Context
from .infrastructure.model_manager import ModelManager
from .infrastructure.infra_check import check_ollama_status
from .utils.utils import Utils

class LLMClient:
    def __init__(self, model: str, base_url: str = 'http://localhost:11434'):
        self.model = model
        self.base_url = base_url
        self.context_manager = Context()
        self.model_manager = ModelManager(self.base_url)
        self.utils = Utils(self)

    def initialize(self):
        if not check_ollama_status(self.base_url):
            raise RuntimeError(f"Ollama runtime not detected at {self.base_url}. Please run 'make initial'.")
        self.model_manager.ensure_model(self.model)

    def prompt(self, message: str, context_id: Optional[str] = None, images: Optional[List[str]] = None, temperature: Optional[float] = None) -> str:
        # 1. Record user message
        user_node = self.context_manager.add_node('user', message, context_id)

        # 2. Fetch full history for this branch
        full_context = self.context_manager.get_full_context(user_node.id)
        messages = []
        for node in full_context:
            msg = {"role": node.role, "content": node.content}
            if node.id == user_node.id and images:
                msg["images"] = images
            messages.append(msg)

        # 3. Call LLM
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False
        }
        if temperature is not None:
            payload["options"] = {"temperature": temperature}

        try:
            response = requests.post(f"{self.base_url}/api/chat", json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            response_content = data.get("message", {}).get("content", "")

            # 4. Record assistant message
            self.context_manager.add_node('assistant', response_content, user_node.id)

            return response_content
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to prompt LLM: {e}")

    def get_context(self) -> Context:
        return self.context_manager
