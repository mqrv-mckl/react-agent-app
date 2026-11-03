<script setup lang="ts">
import { elementList } from "@/main";
</script>

<template>
  <div class="bg-gray-900 p-5 rounded-xl space-y-2">
    <h3>Elements within the app:</h3>
    <p v-if="!elementList.length" class="text-sm text-gray-400">(empty)</p>
    <div
      v-for="element in elementList.values()"
      class="p-2 bg-gray-800 rounded-md"
    >
      <p v-text="element.name" />
      <p
        v-text="'category: ' + element.category"
        class="text-xs text-gray-400"
      />
      <p v-text="'id: ' + element.id" class="text-xs text-gray-400" />
    </div>
  </div>
</template>
