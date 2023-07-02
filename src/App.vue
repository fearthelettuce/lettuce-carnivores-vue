<template>
  <TheHeader />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import TheHeader from '@/components/app/header/TheHeader.vue'
import { useUserStore } from './components/modules/auth/stores/users';

// const userStore = useUserStore()
// onMounted(() => {
//   userStore.setUser()
// })
</script>

<style lang="scss">
@import '@/assets/scss/main';
</style>
