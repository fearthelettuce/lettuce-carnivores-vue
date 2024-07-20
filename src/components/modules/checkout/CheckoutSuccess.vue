<template> 
    <div>
        <h2>Thank you for your purchase!</h2>
    </div>
    <div>
        <h2>What's next?</h2>
        <p>Most orders are shipped within 1 business day</p>
        <a href="https://www.instagram.com/dangerlettuce/" target="_blank">Follow us on Instagram</a>
        <router-link to="care">Click here to learn about care for your new plants</router-link>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/store/order';

const { resetCart } = useOrderStore()


onMounted(() => {
    resetCart()
})
</script>