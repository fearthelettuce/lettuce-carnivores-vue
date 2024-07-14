<template>
    <div class="container">
        <div class="alert alert-warning mb-5">

            The shopping cart is still under construction.  Please message @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.

        </div>
        <div v-if="cart.cartItems.length === 0">
           <p>Cart is empty</p> 
        </div>

        <div class="cart-grid" v-else>
            <div class="cart-item-container ">

                <div v-for="item in cart.cartItems" :key="item.sku" class="cart-item">
                    <router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`">
                        <div class="cart-item-photo">
                            <img :src="getImageUrl(item.photo?.path)" :class="getImageUrl(item.photo?.path) == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${item.name}`" />
                        </div>
                    </router-link>

                        <div class="item-info">
                                <div class="grid-col-2"><router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`">{{`${item.name}`}}</router-link></div>
                                <div class="my-1">Size: {{ item.size }}</div>
                                <div class="my-1" v-if="!item.isRepresentative">Specimen {{ item.sku }}</div>
                                <div class="quantity-input mt-2 input-group input-group-sm">
                                    <span class="input-group-prepend">
                                        <button type="button" class="btn btn-outline-light btn-number btn-sm" @click="decreaseQuantity(item)">
                                            <FontAwesome class="text-light" icon="fa fa-minus"></FontAwesome>
                                        </button>
                                    </span>
                                    <input type="text" class="form-control input-number text-center btn-sm" :value="item.quantity">
                                    <span class="input-group-append">
                                        <button type="button" class="btn btn-outline-light btn-number btn-sm" :disabled="item.quantity >= item.maxQuantity" @click="increaseQuantity(item)">
                                            <FontAwesome class="text-light" icon="fa fa-plus"></FontAwesome>
                                        </button>
                                    </span>
                                </div>
                            
                        </div>

                    <div class="item-subtotal align-content-center">
                        <div class="text-center">{{USDollar.format(item.price * item.quantity) }}</div>
                    </div>
                </div>
            </div>
            <footer>
                <div class="subTotal-grid">
                    
                </div>
                <div class="d-flex flex-row justify-content-end gap-5 m-3">
                    <h3>Subtotal</h3>
                    <h3>
                        {{ USDollar.format(cartTotal)}}
                    </h3>
                    
                </div>
                <div class="d-flex flex-row justify-content-end gap-5 m-3">
                    <h3>Shipping</h3>
                    <h3>
                        {{ USDollar.format(0)}}
                    </h3>
                    
                </div>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-primary" @click.prevent="checkout">Proceed to Checkout</button>
                </div>
            </footer>
        </div>
    </div>





</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '../products/stores/cart';
import { computed, onMounted } from 'vue'
import type { CartItem } from '@/types/Orders'
import {getPhotoUrl, placeholderUrl} from '@/composables/usePhotoUtils'

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

function getImageUrl(path: string) {
    return getPhotoUrl(path ?? null)
}

function checkout() {
    console.log(cart.value.cartItems)
}
</script>

<style scoped>

.cart-item {
    display: flex;
    flex-direction: row;
    margin: 1rem .5rem
}
.cart-item-photo {
    img {
        width: 10rem;
        height: 10rem;
        object-fit: cover;
    }
    
}
.item-subtotal {
    margin: 0 1rem 0 auto;
}
.item-footer {
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    margin: 0 1rem;
}
.item-details {
    padding: 1rem;
    margin: 0 1rem;
}
.item-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1rem 2rem;
}
.quantity-input {
    width: 6rem;
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