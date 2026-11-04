<script setup lang="ts">
// import AppState from "./components/AppState.vue";
import { defineAsyncComponent } from "vue";
import ChatInterface from "./components/ChatInterface.vue";

const AppState = defineAsyncComponent(
  () => import("./components/AppState.vue"),
);
</script>

<template>
  <div class="flex space-x-4 m-4">
    <div>
      <ChatInterface />
    </div>
    <div>
      <Suspense>
        <AppState />
      </Suspense>
    </div>
    <div>
      <AgentState />
    </div>
  </div>
</template>

<style scoped></style>
