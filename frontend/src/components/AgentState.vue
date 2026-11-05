<script setup lang="ts">
import { agentState } from "@/main";
import { computed, type ComputedRef } from "vue";
const defaultButtonStyle: string = "border rounded-full px-2.5 py-1";
const notRunningStyle = defaultButtonStyle + "border-gray-400 text-secondary";
const reasoningStyle = defaultButtonStyle + "border-green-400 text-green-400";
const executingToolStyle =
  defaultButtonStyle + "border-yellow-400 text-yellow-400";

const btnStyle: ComputedRef = computed<string>(() => {
  switch (agentState.value) {
    case "NOT_RUNNING":
      return notRunningStyle;
    case "REASONING":
      return reasoningStyle;
    case "EXECUTING_TOOL":
      return executingToolStyle;
  }
});
const btnText: ComputedRef = computed<string>(() => {
  switch (agentState.value) {
    case "NOT_RUNNING":
      return "Status: Not Running";
    case "REASONING":
      return "Status: Reasoning";
    case "EXECUTING_TOOL":
      return "Status: Executing Tool";
  }
});
</script>

<template>
  <div>
    <button :class="btnStyle" v-text="btnText" />
  </div>
</template>
