<template>
    <div class="container">
        
        <div v-if="cart.cartItems.length === 0">
            Cart is empty
        </div>
        <div v-for="item in cart.cartItems">
            {{ `${item.sku} -${item.quantity}` }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../products/stores/cart';

const { cart } = storeToRefs(useOrderStore())


</script>

<style scoped>

</style>