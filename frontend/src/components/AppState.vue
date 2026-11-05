<script setup lang="ts">
import { elementList } from "@/main";
</script>

<template>
  <div class="component space-y-4">
    <h3>Elements within the app:</h3>
    <p v-if="!elementList.length" class="text-secondary text-sm">(empty)</p>
    <div
      v-for="element in elementList.values()"
      class="py-1.5 px-2.5 bg-secondary rounded-md space-y-0.5"
    >
      <p v-text="element.name" />
      <p
        v-text="'category: ' + element.category"
        class="text-xs text-secondary"
      />
      <p v-text="'id: ' + element.id" class="text-xs text-secondary" />
    </div>
  </div>
</template>
