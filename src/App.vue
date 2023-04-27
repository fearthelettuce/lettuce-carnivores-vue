<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TheHeader from '@/components/app/header/TheHeader.vue'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <TheHeader />
  <RouterView />
</template>

<style lang="scss">
@import '@/assets/scss/main';
</style>
