# Makefile for llm-local-client Monorepo

.PHONY: initial initial-ts initial-py test test-ts test-py start-ollama stop-ollama

# Bootstraps the entire project
initial: start-ollama initial-ts initial-py
	@echo "All dependencies installed and infrastructure running."

# Starts the local LLM runtime (Ollama)
start-ollama:
	@echo "Checking Ollama infrastructure..."
	@docker compose -f docker/docker-compose.llm.yml up -d
	@echo "Waiting for Ollama to be ready..."
	@sleep 5

# Stops the local LLM runtime
stop-ollama:
	@docker compose -f docker/docker-compose.llm.yml down

# Initialize TypeScript package
initial-ts:
	@echo "Initializing TypeScript package..."
	@cd packages/typescript && npm install

# Initialize Python package
initial-py:
	@echo "Initializing Python package..."
	@cd packages/python && pip install -e .[dev]

# Run all tests
test: test-ts test-py

# Run TypeScript tests
test-ts:
	@echo "Running TypeScript tests..."
	@cd packages/typescript && npm run test

# Run Python tests
test-py:
	@echo "Running Python tests..."
	@cd packages/python && pytest
