<script setup lang="ts">
import { chatHistory, queryAgent } from "@/main.ts";
import AgentState from "./AgentState.vue";
let query: string = "";

function enterQuery() {
  queryAgent(query);
  query = "";
}
</script>

<template>
  <div class="component">
    <div class="flex flex-col gap-4">
      <AgentState />
      <div class="flex flex-row gap-1">
        <input
          class="border-rounded"
          @keyup.enter="enterQuery()"
          v-model="query"
          placeholder="Write a query ..."
        />
        <button class="border-rounded" @click="enterQuery()">Enter</button>
      </div>
    </div>
    <div v-for="message in chatHistory.values()" class="mt-2 text-base">
      <hr v-if="message.isUserQuery()" />
      <p
        v-if="message.isUserQuery()"
        class="message bg-secondary rounded-md"
        v-text="'Query: ' + message.content"
      />
      <p
        v-if="message.isAgentResponse() && !message.isFinalAnswer()"
        class="message text-secondary text-sm italic"
        v-text="message.getAgentThought()"
      />
      <p
        v-if="message.isAgentResponse() && message.isFinalAnswer()"
        class="message"
        v-text="message.getAgentThought()"
      />
    </div>
  </div>
</template>

<style scoped></style>
