# llm-local-client

A production-grade, reusable module designed to act as a LEGO block for integrating local LLMs (like Ollama) into any software ecosystem. It provides an advanced tree-based conversation context system and is designed to be agent-first, natively exposing MCP and OpenAPI schemas.

This repository is a monorepo containing dual native implementations:
- **Node.js / TypeScript** (`packages/typescript`)
- **Python** (`packages/python`)

## Features

- **Installability**: Install natively via npm or pip.
- **Agent-First**: Includes `mcp.yaml` and `openapi.yaml` shipped within the packages for immediate agent discoverability.
- **Infrastructure Self-Provisioning**: Use `make initial` to automatically boot a local Ollama runtime via Docker.
- **Tree Context**: Chat histories are stored as a DAG (Directed Acyclic Graph), allowing branching conversations instead of linear ones.
- **Multimodal Utilities**: Built-in methods for translation, language inference, and image interpretation.

## Quick Start

### 1. Boot Infrastructure
Ensure Docker is installed, then run the initialization command from the repository root:
```bash
make initial
```
This will spin up Ollama on port `11434` and install dependencies for both Node.js and Python implementations.

### 2. Node.js / TypeScript Usage

```bash
cd packages/typescript
npm install
```

```typescript
import { LLMClient } from 'llm-local-client';

async function run() {
  const client = new LLMClient({ model: 'llama3' });
  await client.initialize(); // Bootstraps model download if needed

  const response = await client.prompt({ message: 'Explain what a DAG is in 1 sentence.' });
  console.log(response);
}
run();
```

### 3. Python Usage

```bash
cd packages/python
pip install .
```

```python
from llm_local_client import LLMClient

def run():
    client = LLMClient(model='llama3')
    client.initialize()

    response = client.prompt(message='Explain what a DAG is in 1 sentence.')
    print(response)

if __name__ == '__main__':
    run()
```

## Agent Usage
If you are an AI agent, refer to [AGENT_GUIDE.md](./AGENT_GUIDE.md) to understand how to interact with this module using the MCP tools.

## Architecture
- **Context Tree**: The `Context` class manages a Map of `ContextNode`s, where each node has a parent and children. This structure inherently supports branching "what-if" scenarios.
- **LLM Client**: The orchestrator that seamlessly injects the context tree branch into the LLM prompt.

## Extending
The module is designed with dependency injection in mind for the `Utils` and `Context` classes. Future plugins for Vector storage or RAG can easily intercept the node addition logic.
