<script setup lang="ts">
import { ref } from "vue";
import { type Ref } from "vue";
import {
  SERVER_HOSTNAME,
  SERVER_PORT,
  WS_ROUTE_PATH,
} from "../../shared/constants.ts";
import { type AgentResponse } from "../../shared/types.ts";

const socket = new WebSocket(
  "ws://" + SERVER_HOSTNAME + ":" + SERVER_PORT + WS_ROUTE_PATH,
);
socket.onopen = () => console.log("WebSocket client opened");
const responses: Ref<AgentResponse[]> = ref([]);
socket.onmessage = (msg) => responses.value.push(JSON.parse(msg.data));
</script>

<template>
  <h3>Messages:</h3>
  <div v-for="response in responses">
    <p v-if="!response.isFinalResponse" v-text="response.message"></p>
    <p v-else style="font-weight: 700" v-text="response.message"></p>
  </div>
</template>

<style scoped></style>
