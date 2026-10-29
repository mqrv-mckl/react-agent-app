import { upgradeWebSocket, websocket } from "@hono/bun";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { WSContext } from "hono/ws";
import {
  AGENT_AUTO_SUMMARY,
  AGENT_MAX_TURNS,
  API_ROUTE_PATH,
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
import api from "./api.ts";
import { connectClient, createClient } from "./mcp/client";
import mcpServer from "./mcp/server";
import type { Message } from "../shared/types.ts";

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

// websocket
const clients: WSContext[] = [];

// configure routes, etc.
const app = new Hono()
  .use("/api/*", cors())
  .route("/", mcpServer)
  .route(API_ROUTE_PATH, api(agent))
  .get(
    WS_ROUTE_PATH,
    upgradeWebSocket(() => {
      return {
        async onOpen(_, ws) {
          console.log("WebSocket connection opened");
          clients.push(ws);
        },
        onClose(_, ws) {
          clients.splice(clients.indexOf(ws), 1);
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

export type AppType = typeof app;

// connect the mcp client
const transport = new StreamableHTTPClientTransport(
  new URL("http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + MCP_ROUTE_PATH),
);
await connectClient(mcpClient, transport);
await agent.initialize();

export function broadcastMessage(message: Message) {
  for (const client of clients) client.send(JSON.stringify(message));
}
