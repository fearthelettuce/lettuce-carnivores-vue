<template>
    <section class="container-fluid d-flex flex-row justify-content-center">
        <aside>
            <nav>
                <ul>
                    <li>Orders</li>
                    <li>Addresses</li>
                    <li>Security</li>
                </ul>
            </nav>
        </aside>
        <main class="d-flex flex-column mx-5">
            <p>{{ profile?.name }}</p>
            <p>{{ profile?.shippingAddress }}</p>
            <p>{{ profile?.contactInformation }}</p>
        </main>
    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/components/modules/auth/stores/users'
import { storeToRefs } from 'pinia';
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