<template>
  <TheHeader />
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import TheHeader from './components/app/header/TheHeader.vue';
</script>

<style lang="scss">
@import '@/assets/scss/main';
a {
    text-decoration: none;
}

li {
  list-style: none;
}
body {
  width: 100%;
}

</style>
