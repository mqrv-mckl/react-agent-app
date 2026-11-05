<script setup lang="ts">
// import AppState from "./components/AppState.vue";
import { defineAsyncComponent } from "vue";
import ChatInterface from "./components/ChatInterface.vue";

const AppState = defineAsyncComponent(
  () => import("./components/AppState.vue"),
);
</script>

<template>
  <div class="grid grid-cols-3 gap-4 m-4">
    <div class="col-span-2">
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
