<template>
    <section class="container-fluid d-flex flex-row justify-content-center">
        <main class="d-flex flex-column mx-5">
            <p>{{ profile?.name.firstName + ' ' + profile?.name.lastName }}</p>
            <!-- <p>{{ profile?.shippingAddress }}</p> -->
            <p>{{ profile?.contactInformation.email }}</p>
        </main>
        <OrdersList />

    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/components/modules/auth/stores/users'
import { storeToRefs } from 'pinia';
import OrdersList from './OrdersList.vue'

const userStore = useUserStore()
const {profile} = storeToRefs(userStore)

</script>

<style scoped>
    section {
        padding: 0 clamp(.1em, 6vw, 20rem);
        margin: 2em 0;
    }
    ul {
        list-style: none;
    }
</style>