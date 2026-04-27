# Agent Guide: llm-local-client

This document is specifically written for AI Agents consuming or operating within this repository.

## Capabilities Overview

`llm-local-client` exposes capabilities following the Model Context Protocol (MCP). The schema detailing all tools is located at:
- Source: `./mcp/mcp.yaml`
- Bundled (NPM): `node_modules/llm-local-client/mcp.yaml`
- Bundled (Python): `site-packages/llm_local_client/schemas/mcp.yaml`

## Core Concepts for Agents

### 1. Context ID is Crucial
This library does not use linear chat history. Every prompt creates a `ContextNode` with a unique `id`. 
When you use the `prompt` tool, you **must** supply a `context_id` if you want the LLM to remember the previous turn. 

If you omit `context_id`, you start a brand new, isolated branch.

### 2. Branching
Because the context is a tree, you can explore multiple possibilities.
If a user asks "Show me a React implementation", you provide it. The `id` is `node_123`.
If the user then asks "Wait, what about Vue?", you can issue a `prompt` targeting the parent of `node_123`, effectively creating a parallel reasoning thread.

### 3. Usage via MCP
If you have MCP support, load `mcp.yaml`. You will gain access to:
- `prompt(prompt, context_id)`
- `get_context(context_id)`
- `branch_context(parent_id)`

### 4. Direct Programmatic Access
If you are writing code for the user using this library:
- **TypeScript**: `client.getContext().getConversationBranches()`
- **Python**: `client.get_context().get_conversation_branches()`
Use these to analyze the tree structure programmatically.
