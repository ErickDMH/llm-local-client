import requests
from typing import List

class ModelManager:
    def __init__(self, base_url: str = 'http://localhost:11434'):
        self.base_url = base_url

    def list_models(self) -> List[str]:
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=10)
            response.raise_for_status()
            data = response.json()
            return [m.get("name") for m in data.get("models", [])]
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to fetch models from Ollama: {e}")

    def ensure_model(self, model_name: str):
        models = self.list_models()
        if model_name not in models and f"{model_name}:latest" not in models:
            print(f"Model {model_name} not found locally. Attempting to pull...")
            self._pull_model(model_name)

    def _pull_model(self, model_name: str):
        try:
            response = requests.post(f"{self.base_url}/api/pull", json={"name": model_name}, timeout=300)
            response.raise_for_status()
            print(f"Successfully pulled model {model_name}.")
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to pull model {model_name}: {e}")
