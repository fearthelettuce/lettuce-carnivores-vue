<template>
  <TheNavbar />
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import TheNavbar from '@/components/app/header/TheNavbar.vue'
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
