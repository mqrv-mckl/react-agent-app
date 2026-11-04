import { hc } from "hono/client";
import { createApp, ref, type Ref } from "vue";
import { Message } from "../../backend/agent/message.ts";
import type { AppType } from "../../backend/index.ts";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";
import {
  type AgentState,
  type Element,
  type WebSocketMessage,
} from "../../shared/types.ts";
import App from "./App.vue";
import "./style.css";

// hono client (RPC mechanism)
export const client = hc<AppType>(
  "http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + "/",
);

// query the agent using the hono client
export async function queryAgent(query: string): Promise<boolean> {
  const res = await client.api.agent.query.$post({
    json: { query: query },
  });
  if (res.ok) {
    // alert("Successful!");
    return true;
  } else if (res.status.toString() === "400") {
    alert("Failed! Agent is already running.");
  } else {
    alert("Failed!");
  }
  return false;
}

// web socket
const socket = new WebSocket(
  "ws://" + SERVER_HOSTNAME + ":" + SERVER_PORT + WS_ROUTE_PATH,
);
socket.onopen = () => console.log("WebSocket client opened");

// reactive message list, element list and agent state
export const messageList: Ref<Message[]> = ref([]);
export const elementList: Ref<Element[]> = ref([]);
export const agentState: Ref<AgentState> = ref("NOT_RUNNING");
socket.onmessage = (msg) => {
  const parsed: WebSocketMessage = JSON.parse(msg.data);
  if (parsed.type === "agent_message") {
    const message: Message = JSON.parse(parsed.data);
    console.log("WebSocket: Received agent_message: " + JSON.parse(msg.data));
    messageList.value.push(new Message(message.role, message.content));
  } else if (parsed.type === "agent_state") {
    agentState.value = parsed.data as AgentState;
    console.log("WebSocket: Received agent_state: " + JSON.parse(msg.data));
  }
  fetchElementList();
};
async function fetchElementList() {
  const res = await client.api.app.elements.$get();
  if (!res.ok) throw new Error("Unable to fetch element list");
  elementList.value = await res.json();
}

createApp(App).mount("#app");
