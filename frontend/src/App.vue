<script setup lang="ts">
import { hc } from "hono/client";
import { ref, type Ref } from "vue";
import { Message } from "../../backend/agent/message.ts";
import type { AppType } from "../../backend/index.ts";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";

// web socket
const socket = new WebSocket(
  "ws://" + SERVER_HOSTNAME + ":" + SERVER_PORT + WS_ROUTE_PATH,
);
socket.onopen = () => console.log("WebSocket client opened");
const messages: Ref<Message[]> = ref([]);
socket.onmessage = (msg) => {
  const parsed: Message = JSON.parse(msg.data);
  messages.value.push(new Message(parsed.role, parsed.content));
};

// hono client (RPC mechanism)
const client = hc<AppType>(
  "http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + "/",
);

// query the agent using the hono client
async function queryAgent(query: string) {
  const res = await client.api.agent.query.$post({
    json: { query: query },
  });
  if (res.ok) {
    alert("Successful!");
  } else if (res.status.toString() === "400") {
    alert("Failed! Agent is already running.");
  } else {
    alert("Failed!");
  }
}

let query: string = "";
</script>

<template>
  <h3>Input:</h3>
  <div>
    <input v-model="query" placeholder="Write a query ..." />
    <button
      @click="
        {
          queryAgent(query);
          query = '';
        }
      "
    >
      Enter
    </button>
  </div>
  <h3>Messages:</h3>
  <div v-for="message in messages.values()">
    <p v-if="message.isUserQuery()" v-text="'User: ' + message.content"></p>
    <p
      v-if="message.isAgentResponse()"
      :style="message.isFinalAnswer() ? { fontWeight: 700 } : {}"
      v-text="'Assistant: ' + message.getAgentThought()"
    ></p>
  </div>
</template>

<style scoped></style>
