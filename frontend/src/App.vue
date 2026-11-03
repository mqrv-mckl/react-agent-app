<script setup lang="ts">
import AppState from "./components/AppState.vue";
import ChatInterface from "./components/ChatInterface.vue";
</script>

<template>
  <div>
    <div class="m-5">
      <ChatInterface />
    </div>
    <div class="m-5">
      <AppState />
    </div>
  </div>
</template>

<style scoped></style>
