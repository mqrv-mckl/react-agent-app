import { hc } from "hono/client";
import { createApp, ref, type Ref } from "vue";
import { Message } from "../../backend/agent/message.ts";
import type { AppType } from "../../backend/index.ts";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";
import { type Element } from "../../shared/types.ts";
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

// reactive message and element list
export const messageList: Ref<Message[]> = ref([]);
export const elementList: Ref<Element[]> = ref([]);
socket.onmessage = (msg) => {
  console.log("Message received:", JSON.parse(msg.data));
  const parsed: Message = JSON.parse(msg.data);
  messageList.value.push(new Message(parsed.role, parsed.content));

  fetchElementList();
};
async function fetchElementList() {
  const res = await client.api.app.elements.$get();
  if (!res.ok) throw new Error("Unable to fetch element list");
  elementList.value = await res.json();
}

createApp(App).mount("#app");
