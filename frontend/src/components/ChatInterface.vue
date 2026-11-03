<script setup lang="ts">
import { queryAgent, messageList } from "@/main.ts";
import { ref } from "vue";
let query: string = "";
const inputAndButtonStyling = ref("border my-2 p-1 rounded-md");
</script>

<template>
  <div class="flex flex-col bg-gray-900 p-5 rounded-xl max-w-200">
    <h3>Input:</h3>
    <div class="space-x-2">
      <input
        :class="inputAndButtonStyling"
        @keyup.enter="queryAgent(query)"
        v-model="query"
        placeholder="Write a query ..."
      />
      <button
        :class="inputAndButtonStyling"
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
    <hr class="my-4 border-gray-500" />
    <div v-for="message in messageList.values()">
      <p
        class="bg-gray-700 rounded-md my-1 p-1"
        v-if="message.isUserQuery()"
        v-text="'User: ' + message.content"
      ></p>
      <p
        class="rounded-md my-1 p-1"
        v-if="message.isAgentResponse()"
        :style="
          message.isFinalAnswer()
            ? { fontWeight: 700 }
            : { fontStyle: 'italic' }
        "
        v-text="'Assistant: ' + message.getAgentThought()"
      ></p>
    </div>
  </div>
</template>

<style scoped></style>
