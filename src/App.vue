<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <v-locale-provider locale="en">
    <v-app class="bg-background">
      <RouterView />
    </v-app>
  </v-locale-provider>
</template>

<style scoped></style>
