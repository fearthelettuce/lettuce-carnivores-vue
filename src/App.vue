<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/app/header/TheHeader.vue'
</script>

<template>
  <TheHeader />
  <RouterView />
</template>

<style lang="scss">
@import '@/assets/scss/main';
</style>
