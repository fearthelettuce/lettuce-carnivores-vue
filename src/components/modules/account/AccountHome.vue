<template>
    <section class="container-fluid d-flex justify-content-center">
        <p>{{ userStore.getUserProfile?.name.firstName }}</p>
        <p>{{ userStore.getUserProfile?.name.lastName }}</p>
        <p>{{ userStore.getUserProfile?.shippingAddress?.address1 }}</p>
    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/components/modules/auth/stores/users'

const userStore = useUserStore()

</script>

<style scoped>
    section {
        padding: 0 clamp(.1em, 6vw, 20rem);
        margin: 2em 0;
    }
</style>