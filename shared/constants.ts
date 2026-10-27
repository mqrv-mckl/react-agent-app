export const LLM_BASE_URL = "http://localhost:8080/v1";
export const LLM_API_KEY = "dummy";
export const LLM_CONTEXT_LENGTH = 262144; // https://huggingface.co/unsloth/Qwen3.8-27B-GGUF#model-overview
export const LLM_CHARS_PER_TOKEN = 4; // https://qwen.readthedocs.io/en/latest/getting_started/concepts.html#byte-level-byte-pair-encoding

export const AGENT_MAX_TURNS = 10;
export const AGENT_AUTO_SUMMARY = true;

export const MCP_SERVER_VERSION = "1.0.0";
export const MCP_CLIENT_NAME = "client";

export const SERVER_PORT = 3000;
export const SERVER_HOSTNAME = "localhost";

export const MCP_ROUTE_PATH = "/mcp";
export const WS_ROUTE_PATH = "/ws";
