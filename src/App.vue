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
body {
  @apply bg-stone-800 ;
  padding: 0 clamp(.1dvw, 2.5dvw, 10dvw);
  width: 100%;
}

</style>
