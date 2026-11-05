import { hc } from "hono/client";
import { createApp, ref, shallowRef, type Ref } from "vue";
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

// reactive message list, element list and agent state
export const agentState: Ref<AgentState> = ref(await fetchAgentState());
export const chatHistory: Ref<Message[]> = shallowRef(await fetchChatHistory());
export const elementList: Ref<Element[]> = ref(await fetchElementList());

// api wrapper functions
async function fetchAgentState(): Promise<AgentState> {
  const res = await client.api.agent.state.$get();
  if (!res.ok) throw new Error("Unable to fetch agent state");
  return (await res.json()).state;
}
async function fetchChatHistory(): Promise<Message[]> {
  const res = await client.api.agent.chatHistory.$get();
  if (!res.ok) throw new Error("Unable to fetch chat history");
  const messageList: Message[] = [];
  (await res.json()).messageList.forEach((m) =>
    messageList.push(new Message(m.role, m.content)),
  );
  return messageList;
}
async function fetchElementList(): Promise<Element[]> {
  const res = await client.api.app.elements.$get();
  if (!res.ok) throw new Error("Unable to fetch element list");
  return await res.json();
}
export async function queryAgent(query: string): Promise<boolean> {
  const res = await client.api.agent.query.$post({
    json: { query: query },
  });
  if (res.ok) {
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
socket.onmessage = async (msg) => {
  const wsMsg: WebSocketMessage = msg.data;
  switch (wsMsg) {
    case "NOTIFY_AGENT_STATE_CHANGED":
      console.log("Agent state has changed. Updating...");
      agentState.value = await fetchAgentState();
      break;
    case "NOTIFY_NEW_AGENT_MESSAGE":
      console.log("Message list has change. Updating...");
      chatHistory.value = await fetchChatHistory();
      break;
  }
  elementList.value = await fetchElementList();
};

createApp(App).mount("#app");
