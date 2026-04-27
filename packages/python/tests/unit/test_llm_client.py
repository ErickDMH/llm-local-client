import pytest
from unittest.mock import patch, MagicMock
from llm_local_client import LLMClient

@pytest.fixture
def client():
    return LLMClient(model='llama3', base_url='http://localhost:11434')

@patch('llm_local_client.llm_client.check_ollama_status')
@patch('llm_local_client.infrastructure.model_manager.requests.get')
def test_initialize_and_check_status(mock_get, mock_check_status, client):
    mock_check_status.return_value = True
    mock_response = MagicMock()
    mock_response.json.return_value = {"models": [{"name": "llama3:latest"}]}
    mock_get.return_value = mock_response

    try:
        client.initialize()
    except Exception as e:
        pytest.fail(f"initialize raised an exception {e}")

@patch('llm_local_client.llm_client.check_ollama_status')
def test_throw_error_if_runtime_down(mock_check_status, client):
    mock_check_status.return_value = False
    with pytest.raises(RuntimeError, match="Ollama runtime not detected"):
        client.initialize()

@patch('llm_local_client.llm_client.requests.post')
def test_prompt_calls_ollama_and_returns_response(mock_post, client):
    mock_response = MagicMock()
    mock_response.json.return_value = {"message": {"content": "This is the response"}}
    mock_post.return_value = mock_response

    response = client.prompt(message="Hello")
    assert response == "This is the response"

    # Verify context tree was updated
    context = client.get_context()
    branches = context.get_conversation_branches()
    assert len(branches) == 1
    assert len(branches[0]) == 2 # user message, then assistant message
