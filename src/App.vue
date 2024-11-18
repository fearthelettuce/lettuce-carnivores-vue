<template>
  <TheHeader />
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import TheHeader from '@/components/header/TheHeader.vue';
</script>

<style lang="scss">
@import '@/assets/scss/main';
a {
    text-decoration: none;
}

li {
  list-style: none;
}

</style>
