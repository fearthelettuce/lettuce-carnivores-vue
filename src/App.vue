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
  width: 100dvw;
}

.contain {
    
}
.grid-col-2 {
    grid-column: span 2;
}
.grid-col-3 {
    grid-column: span 3;
}
.grid-col-4 {
    grid-column: span 4;
}
.grid-col-5 {
    grid-column: span 5;
}
.grid-col-10 {
    grid-column: span 10;
}

</style>
