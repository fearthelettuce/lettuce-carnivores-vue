<template>
    <div class="container">
        <div class="alert alert-warning">

            The shopping cart is still under construction.  Please message @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.

        </div>
        <div v-if="cart.cartItems.length === 0">
            Cart is empty
        </div>
        <div class="cart-grid">
            <div class="cart-item-grid">
                <div>Item #</div>
                <div>Quantity</div>
                <div>Price</div>
            </div>
            <div v-for="item in cart.cartItems" :key="item.sku" class="cart-item-grid">
                    <div>{{item.sku}}</div>
                    <div>{{item.quantity}}</div>
                    <div>${{item.price}}</div>
                    
                        <button class="btn btn-warning mx-4" @click="decreaseQuantity(item)">Remove 1</button>
                        <button class="btn btn-success mx-4" @click="increaseQuantity(item)">Add 1</button>
                        <button class="btn btn-danger mx-4" @click="deleteItem(item)">Delete</button>
                    
                    


            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../products/stores/cart';
import { onMounted } from 'vue'
import type { CartItem } from '@/types/Orders'

const { cart } = storeToRefs(useOrderStore())
const { getCategoryBySku, addItemToCart, removeItemFromCart } = useOrderStore()

onMounted(() => {
    cart.value.cartItems.forEach(item => getCategoryBySku(item))
})
function increaseQuantity(item: CartItem) {
    addItemToCart(item)
}
function decreaseQuantity(item: CartItem) {
    if(item.quantity <= 1) {
        deleteItem(item)
        return
    } else {
        removeItemFromCart(item, false)
    }
}
function deleteItem(item: CartItem) {
    removeItemFromCart(item, true)
}

</script>

<style scoped>

.cart-grid {
    display: grid;
    grid-template-columns: repeat(1fr);
    gap: 2rem;
}
.cart-item-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    border: 1px solid lightcoral;
    padding: 1rem 1rem;
    align-items: center;
    justify-content: center;

}
</style>