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
const messages: Ref<AgentResponse[]> = ref([]);
socket.onmessage = (msg) => messages.value.push(JSON.parse(msg.data));
</script>

<template>
  <h3>Messages:</h3>
  <p v-for="message in messages" v-text="message"></p>
</template>

<style scoped></style>
