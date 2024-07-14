<template>
    <div class="container">
        <div class="alert alert-warning">

            The shopping cart is still under construction.  Please message @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.

        </div>
        <div v-if="cart.cartItems.length === 0">
            Cart is empty
        </div>
        <div class="cart-grid">
            <header class="cart-item-labels">
                <div class="grid-col-2">Item</div>
                <div class="text-center">Size</div>
                <div class="text-center">Price</div>
                <div>Quantity</div>
            </header>
            <div v-for="item in cart.cartItems" :key="item.sku" >
                <div class="cart-item-container">
                    
                    <div class="cart-item-grid">
                        <div class="grid-col-2"><router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`">{{`${item.name}${!item.isRepresentative ? ': specimen ' + item.sku : ''}`}}</router-link></div>
                        <div class="text-center">{{ item.size }}</div>
                        <div class="text-center">{{USDollar.format(item.price) }}</div>
                        <div class="input-group">
                            <span class="input-group-prepend">
                                <button type="button" class="btn btn-outline-light btn-number" @click="decreaseQuantity(item)">
                                    <FontAwesome class="text-light" icon="fa fa-minus"></FontAwesome>
                                </button>
                            </span>
                            <input type="text" class="form-control input-number text-center" :value="item.quantity">
                            <span class="input-group-append">
                                <button type="button" class="btn btn-outline-light btn-number" :disabled="item.quantity >= item.maxQuantity" @click="increaseQuantity(item)">
                                    <FontAwesome class="text-light" icon="fa fa-plus"></FontAwesome>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="d-flex flex-row justify-content-center gap-5">
                <h3>Subtotal</h3>
                <h3>
                    {{ USDollar.format(cartTotal)}}
                </h3>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../products/stores/cart';
import { computed, onMounted } from 'vue'
import type { CartItem } from '@/types/Orders'

const { cart } = storeToRefs(useOrderStore())
const { getCategoryBySku, addItemToCart, removeItemFromCart } = useOrderStore()

onMounted(() => {
    cart.value.cartItems.forEach(item => getCategoryBySku(item))
})

const cartTotal = computed(() => {
    return cart.value.cartItems.reduce(
        (accumulator, cartItem) => accumulator + (cartItem.price * cartItem.quantity), 0)
})


const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, 
});

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
    gap: 1rem;
}
.cart-item-container {
    background:var(--bs-body-bg);
    filter: brightness(85%);
    padding: 1rem 1rem;
    border-radius: .6rem;
}
.cart-item-labels { 
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    border-radius: .6rem;
    align-items: center;
    justify-content: center;

}
</style>