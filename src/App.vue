<template>
  <div class="page-container">
    <TheHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/header/TheHeader.vue';
</script>

<style lang="scss">
@use '@/assets/scss/main.scss';
html {
  // background: $light-bg !important;
}
a {
    text-decoration: none;
}

li {
  list-style: none;
}
main {
  margin-block: 1rem;
}
main:first-child {
  margin: auto;
} 
.page-container {
  margin: auto;
  width: 96dvw;
}

@media(min-width: 425px) {
  .page-container  {
    width: 90dvw;
  }
}

</style>
