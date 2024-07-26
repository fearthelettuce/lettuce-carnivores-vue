<template>
    <section class="container-fluid d-grid">
        <main class="d-flex flex-row justify-content-around">
            <p v-if="profile">{{ profile?.name.firstName + ' ' + profile?.name.lastName }}</p>
            <p v-if="profile">{{ profile?.contactInformation.email }}</p>
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
        padding: 0 clamp(.05rem, 6vw, 20rem);
        margin: 2em 0;
    }
    ul {
        list-style: none;
    }
</style>