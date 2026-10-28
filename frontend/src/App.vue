<script setup lang="ts">
import { hc } from "hono/client";
import { ref, type Ref } from "vue";
import type { AppType } from "../../backend/index.ts";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";
import type { AgentResponse } from "../../shared/types.ts";

const client = hc<AppType>(
  "http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + "/",
);

function queryAgent(query: string) {
  client.api.agent.query.$post({
    json: { query: query },
  });
}

const socket = new WebSocket(
  "ws://" + SERVER_HOSTNAME + ":" + SERVER_PORT + WS_ROUTE_PATH,
);
socket.onopen = () => console.log("WebSocket client opened");
const responses: Ref<AgentResponse[]> = ref([]);
socket.onmessage = (msg) => responses.value.push(JSON.parse(msg.data));

let query: string = "";
</script>

<template>
  <h3>Input:</h3>
  <div>
    <input v-model="query" placeholder="Write a query ..." />
    <button @click="queryAgent(query)">Enter</button>
  </div>
  <h3>Messages:</h3>
  <div v-for="response in responses">
    <p v-if="!response.isFinalResponse" v-text="response.message"></p>
    <p v-else style="font-weight: 700" v-text="response.message"></p>
  </div>
</template>

<style scoped></style>
