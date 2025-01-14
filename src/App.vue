<template>
  <TheNavbar />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from './components/header/TheNavbar.vue';
</script>

<style lang="scss">
@use '@/assets/scss/main.scss';
a {
    text-decoration: none;
}

li {
  list-style: none;
}

</style>
