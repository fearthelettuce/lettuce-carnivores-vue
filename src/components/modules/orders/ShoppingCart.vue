<template>
    <div class="container">
        <div class="alert alert-warning">

            The shopping cart is still under construction.  Please message @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.

        </div>
        <div v-if="cart.cartItems.length === 0">
            Cart is empty
        </div>
        <div class="cart-grid">
            <div class="cart-item-labels">
                <div class="grid-col-2">Item</div>
                <div>Item #</div>
                <div>Quantity</div>
                <div>Price</div>
            </div>
            <div v-for="item in cart.cartItems" :key="item.sku" class="cart-item-grid">
                    <div class="grid-col-2">{{item.name}}</div>
                    <div>{{ item.sku }}</div>
                    <div>{{item.quantity}}</div>
                    <div>${{item.price}}</div>
                    
                        <button class="btn btn-warning mx-3" @click="decreaseQuantity(item)">Remove 1</button>
                        <button class="btn btn-success mx-3" @click="increaseQuantity(item)">Add 1</button>
                        <button class="btn btn-danger mx-3" @click="deleteItem(item)">Delete</button>
                    
                    


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
        return
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
    gap: 0rem;
}
.cart-item-labels { 
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 1rem;
    background:var(--bs-body-bg);
    filter: brightness(85%);
    border-radius: .6rem;
    padding: .5rem 1rem;
    align-items: center;
    justify-content: center;
}
.cart-item-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 1rem;
    background:var(--bs-body-bg);
    filter: brightness(85%);
    border-radius: .6rem;
    padding: 1rem 1rem;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;

}
</style>