<template> 
    <div class="container-fluid text-center mt-4">
        <div>
            <h2>Thank you for your purchase!</h2>
        </div>
        <div class="my-3">
            <h3>What's next?</h3>
            <p>Most orders are shipped within 1 business day</p>
            <div class="mb-2">
                <a href="https://www.instagram.com/dangerlettuce/" target="_blank">Follow us on Instagram</a>
            </div>
            <router-link to="care">Click here to learn about care for your new plants</router-link>
            <div v-if="user!.isAnonymous">
                <router-link to="/login">Create an account to track your orders</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/store/order';
import { useUserStore } from '../auth/stores/users';
import { storeToRefs } from 'pinia'

const {user} = storeToRefs(useUserStore())
const { resetCart } = useOrderStore()


onMounted(() => {
    resetCart()
})
</script>