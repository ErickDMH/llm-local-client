import requests

def check_ollama_status(base_url: str = 'http://localhost:11434') -> bool:
    try:
        response = requests.get(f"{base_url}/api/tags", timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False
