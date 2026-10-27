import { upgradeWebSocket, websocket } from "@hono/bun";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { Hono } from "hono";
import {
  AGENT_AUTO_SUMMARY,
  AGENT_MAX_TURNS,
  LLM_API_KEY,
  LLM_BASE_URL,
  LLM_CHARS_PER_TOKEN,
  LLM_CONTEXT_LENGTH,
  MCP_CLIENT_NAME,
  MCP_ROUTE_PATH,
  MCP_SERVER_VERSION,
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../shared/constants";
import { Agent } from "./agent/agent";
import { Chat } from "./agent/chat";
import { ChatHistory } from "./agent/chatHistory";
import type { AutoSummaryOptions } from "./agent/types";
import { connectClient, createClient } from "./mcp/client";
import mcpServer from "./mcp/server";

// define the MCP Client
const mcpClient = createClient(MCP_SERVER_VERSION, MCP_CLIENT_NAME);

// define and initialize the agent
const autoSummaryOptions: AutoSummaryOptions = {
  contextLength: LLM_CONTEXT_LENGTH,
  charactersPerToken: LLM_CHARS_PER_TOKEN,
};
const agent = new Agent(
  mcpClient,
  new Chat(LLM_BASE_URL, LLM_API_KEY),
  new ChatHistory(
    new Chat(LLM_BASE_URL, LLM_API_KEY),
    AGENT_AUTO_SUMMARY,
    autoSummaryOptions,
  ),
  AGENT_MAX_TURNS,
);

// configure routes, etc.
const app = new Hono();
app.route("/", mcpServer);
app.get("/", (c) => c.text("hello world"));

// websocket
app.get(
  WS_ROUTE_PATH,
  upgradeWebSocket(() => {
    return {
      onOpen() {
        console.log("WebSocket connection opened");
      },
      onMessage(message) {
        // TODO: implement
      },
      onClose() {
        console.log("WebSocket connection closed");
      },
    };
  }),
);

// serve app (including the mcp server)
const server = Bun.serve({
  port: SERVER_PORT,
  fetch: app.fetch,
  websocket: websocket,
});
console.log(`Listening on ${server.hostname}:${server.port}`);

// connect the mcp client
const transport = new StreamableHTTPClientTransport(
  new URL("http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + MCP_ROUTE_PATH),
);
await connectClient(mcpClient, transport);
await agent.initialize();

// query the agent to test if everything works
// await agent.query(
//   "Add the container element to the app, that aligns it's children in one line.",
// );
