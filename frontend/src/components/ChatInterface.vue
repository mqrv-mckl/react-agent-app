<script setup lang="ts">
import { queryAgent, messageList } from "@/main.ts";
import AgentState from "./AgentState.vue";
import { ref } from "vue";
let query: string = "";
const inputAndButtonStyling = ref("border my-2 p-1 rounded-md");

function enterQuery() {
  queryAgent(query);
  query = "";
}
</script>

<template>
  <div class="flex flex-col bg-gray-900 px-5 p-3 rounded-xl w-150">
    <div>
      <AgentState class="my-2" />
    </div>
    <div class="flex flex-row space-x-2 items-center">
      <input
        :class="inputAndButtonStyling"
        @keyup.enter="enterQuery()"
        v-model="query"
        placeholder="Write a query ..."
      />
      <button :class="inputAndButtonStyling" @click="enterQuery()">
        Enter
      </button>
    </div>
    <hr class="my-4 border-gray-500" v-if="messageList.length != 0" />
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
