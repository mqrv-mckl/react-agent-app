<script setup lang="ts">
import { hc } from "hono/client";
import { ref, type Ref } from "vue";
import type { AppType } from "../../backend/index.ts";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";
import type { Message } from "../../shared/types.ts";

// web socket
const socket = new WebSocket(
  "ws://" + SERVER_HOSTNAME + ":" + SERVER_PORT + WS_ROUTE_PATH,
);
socket.onopen = () => console.log("WebSocket client opened");
const messages: Ref<Message[]> = ref([]);
socket.onmessage = (msg) => messages.value.push(JSON.parse(msg.data));

// hono client (RPC mechanism)
const client = hc<AppType>(
  "http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + "/",
);

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
    <button @click="queryAgent(query)">Enter</button>
  </div>
  <h3>Messages:</h3>
  <!-- TODO: nice formatting of all messages (instead of plain JSON) -->
  <div v-for="message in messages">
    <p v-if="message.role === 'user'" v-text="'User: ' + message.content"></p>
    <p
      v-if="message.role === 'assistant'"
      v-text="'Assistant: ' + message.content"
    ></p>
  </div>
  <!-- <div v-for="response in responses"> -->
  <!--   <p v-if="!response.isFinalResponse" v-text="response.message"></p> -->
  <!--   <p v-else style="font-weight: 700" v-text="response.message"></p> -->
  <!-- </div> -->
</template>

<style scoped></style>
