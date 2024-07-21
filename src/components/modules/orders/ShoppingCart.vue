<template>
    <div class="mx-5 alert alert-warning mb-3">
    The shopping cart is in Test mode.  Use credit card number 4242 4242 4242 4242 with any future expiration date and any CVV to test checkout.
    </div>
    <div class="container mb-3">
        
        <div class="d-flex justify-content-center" v-if="cart.cartItems.length === 0">
           <p>Cart is empty</p> 
        </div>

        <div class="cart-grid" v-else>
            <div class="cart-item-container ">
                <div v-for="item in cart.cartItems" :key="item.sku" class="cart-item">
                    <router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`" class="align-content-center">
                        <div class="cart-item-photo">
                            <img :src="getImageUrl(item)" :class="getImageUrl(item) == placeholderUrl ? 'placeholderImage': 'cardImage'" :alt="`An image of ${item.name}`" />
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

                    <div class="item-subtotal">
                        <div class="text-center">{{USDollar.format(item.price * item.quantity) }}</div>
                    </div>
                </div>
            </div>
            <footer class="d-flex flex-column">
                <div class="subtotal d-flex flex-column">
                    <div v-if="!cart.shipping.isDiscounted" class="qualify-for-free-shipping">{{ `Add ${amountToQualifyForDiscountedShipping} more to your cart to quality for free standard shipping.` }}</div>
                    <div class="d-flex flex-row justify-content-end align-items-center gap-3 my-2">
                        <Select 
                            :options="shippingOptions" 
                            v-model="cart.shipping"
                            optionLabel="label"
                            id="selectShipping" 
                            label="Shipping Method"
                            :pt="{ 
                                dropdown: { style: 'width: 1.5rem; padding: 0 .5rem 0 0;'},
                                label: { style: 'padding: .5rem;'},
                                option: { 
                                    selected: {style: 'color: red;'},
                                    selectedBackground: {style: 'color: red'}
                                },
                            }"
                        />
                        <h3 class="m-0">
                            {{ USDollar.format(cart.shipping.value)}}
                        </h3>
                    
                    </div>
                    <div class="d-flex flex-row justify-content-end gap-2 mx-2 my-2">
                        <h3 class="m-0">Subtotal</h3>
                        <h3 class="m-0">
                            {{ USDollar.format(cartTotal + cart.shipping.value)}}
                        </h3>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-primary" @click.prevent="checkout" :disabled="cart.cartItems.length === 0 || isLoading">Proceed to Checkout <span class="spinner-border" role="status" v-show="isLoading"></span></button>
                </div>
            </footer>
        </div>
    </div>





</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/store/order';
import { computed, onMounted } from 'vue'
import type { CartItem } from '@/types/Orders'
import {getPhotoUrl, placeholderUrl} from '@/composables/usePhotoUtils'
import { toast } from 'vue3-toastify';
import type { Plant } from '@/types/Plant'
import Select from 'primevue/select';
import { discountedShippingThreshold } from '@/constants/OrderConstants'

const { cart } = storeToRefs(useOrderStore())
const { getCategoryBySku, addItemToCart, removeItemFromCart, startCheckoutSession, updateShipping } = useOrderStore()
const { cartTotal, shippingOptions, isLoading } = storeToRefs(useOrderStore())

const amountToQualifyForDiscountedShipping = computed(() => {
    if(cartTotal.value >= discountedShippingThreshold) { return USDollar.format(0)}
    else {
        return USDollar.format(discountedShippingThreshold - cartTotal.value)
    }
})
onMounted(() => {
    cart.value.cartItems.forEach(item => getCategoryBySku(item))
    updateShipping()
    //validated cart it still valid, display TCGPlayer style message "you're cart sucks"
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

function getImageUrl(cartItem: CartItem) {
    if(cartItem.photo && cartItem.photo.path) {
        return getPhotoUrl(cartItem.photo.path, 256)
    } else {
        return getPhotoUrl(null)
    }
}

async function checkout() {
    //console.log(cart.value.cartItems)
    if(cart.value.cartItems.length > 0) {
        const res = await startCheckoutSession()
        if(res && res.error === true) {toast.error(res.message)}
    }
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
        width: 6rem;
        height: 8rem;
        object-fit: cover;
        border-radius: .5rem;
    }
}
.item-subtotal {
    margin: 0 .5rem 0 auto;
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
    margin: 0 .8rem;
}
.qualify-for-free-shipping {
    text-align: center;
    margin: .5rem 0;
}
.quantity-input {
    width: 6rem;
}
.spinner-border {
    height: 1rem;
    width: 1rem;
    margin-left: 1rem;
}
.cart-item-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background:var(--bs-body-bg);
    filter: brightness(85%);
    padding: .5rem .5rem;
    border-radius: .6rem;
    
}

@media(min-width: 27rem) {
    .cart-item-photo {
        img {
            width: 10rem;
            height: 10rem;
            object-fit: cover;
        }
    }
    .item-info {
        margin: .5rem 1rem .5rem 2rem;
    }
    .item-subtotal {
        margin: .5rem .5rem 0 auto;
    }
}
@media(min-width: 60rem) {
    .cart-item-photo {
        img {
            width: 16rem;
            height: 16rem;
            object-fit: cover;
        }
    }
    .cart-item-container {
        padding: 1rem 1rem;
    }
}
</style>