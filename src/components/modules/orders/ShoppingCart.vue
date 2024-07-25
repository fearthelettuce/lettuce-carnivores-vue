<template>
    <div class="mx-5 alert alert-warning mb-3">
    The shopping cart is in Test mode.  Use credit card number 4242 4242 4242 4242 with any future expiration date and any CVV to test checkout.
    </div>
    <div v-if="cartErrors !== null" class="mx-5 alert alert-warning mb-3">
    {{ cartErrors }}
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
            <div class="subtotal-container">
                <div class="subtotal">
                    
                    <div class="subtotal-line">
                        <h3 class="m-0">Subtotal</h3>
                        <h3 class="m-0">
                            {{ USDollar.format(cartTotal)}}
                        </h3>
                    </div>
                    <div class="d-flex flex-row justify-content-center gap-2 mx-4 mb-4">
                        <h5 class="shipping-message">
                            {{ cartTotal >= discountedShippingThreshold ?
                             `Free standard shipping on orders over $75!` :
                              `Add ${amountToQualifyForDiscountedShipping} to quality for free standard shipping.` 
                              }}
                        </h5>
                        
                    </div>
                </div>
            </div>
            <footer class="footer sticky-bottom">
                <div class="checkout-actions">
                    <button v-if="!isLoggedIn" class="btn btn-info btn-lg text-white" @click="router.push('/login')">Login</button>

                    <button class="checkout-button" 
                        @click.prevent="checkout" 
                        :disabled="cart.cartItems.length === 0 || isCheckoutLoading"
                    >
                        {{isLoggedIn ? `Checkout` : `Checkout as Guest`}} <span class="spinner-border" role="status" v-show="isCheckoutLoading"></span>
                    </button>
                </div>
            </footer>

        </div>
    </div>





</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/store/order';
import { ref, type Ref, computed, onMounted } from 'vue'
import type { CartItem } from '@/types/Orders'
import {getPhotoUrl, placeholderUrl} from '@/composables/usePhotoUtils'
import { toast } from 'vue3-toastify';
import { discountedShippingThreshold } from '@/constants/OrderConstants'
import { useUserStore } from '../auth/stores/users'
import { router } from '@/router'

const { cart } = storeToRefs(useOrderStore())
const { getCategoryBySku, addItemToCart, removeItemFromCart, startCheckoutSession, updateShipping, validateCart} = useOrderStore()
const { cartTotal, isLoading } = storeToRefs(useOrderStore())
const { loginAnonymously, isLoggedIn, isUserLoading } = useUserStore()

const amountToQualifyForDiscountedShipping = computed(() => {
    if(cartTotal.value >= discountedShippingThreshold) { return USDollar.format(0)}
    else {
        return USDollar.format(discountedShippingThreshold - cartTotal.value)
    }
})
onMounted(() => {
    getCartErrors()
    cart.value.cartItems.forEach(item => getCategoryBySku(item))
    updateShipping()
    //validated cart it still valid, display TCGPlayer style message "you're cart sucks"
})

const isCheckoutLoading = computed(() => {
    return isLoading.value || isUserLoading
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
    await getCartErrors()
    if(cartErrors.value !== null) {
        toast.error('Some items are no longer available, please review cart and try again')
        return
    }
    if(!useUserStore().isLoggedIn) {
        await loginAnonymously()
    }
    if(cart.value.cartItems.length > 0) {
        const res = await startCheckoutSession()
        window.location.replace(res.data.url)
        if(!res || res.error === true) {toast.error(res?.message || 'Unable to open checkout page')}
    }
}
const cartErrors: Ref<string | null> = ref(null)
async function getCartErrors() {
    cartErrors.value = null
    const errors = await validateCart()
    if(errors !== '') {
        cartErrors.value = errors
    }
}
</script>

<style scoped lang="scss">

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
.shipping-message {
    margin: .5rem 0;
    text-align: center;
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
.subtotal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
    margin-right: 1rem;
}
.subtotal-line {
    display: flex;
    justify-content: center;
    gap: 1rem;
}
.subtotal-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 4rem;
}
.checkout-button {
    border-radius: .5rem;
    background: linear-gradient(0.15turn,#FFBF46, #fccb72, #FFBF46);
    padding: .5rem 1.25rem;
    border: none;
    color: black;
    font-size: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 0 2px darkslategray;
}
.checkout-button:hover {
    filter: brightness(105%);
}
.checkout-button:active {
    box-shadow: 2px 3px darkslategray;
    transform: translateY(4px);
}
.checkout-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    background: linear-gradient(0.4turn, #9fdb50, #A1C181, #9fdb50);
    //background: linear-gradient(0.4turn, #9fdb50, #ebf8e1, #3f87a6);
    padding: .6rem 0;
    border-radius: 1rem;
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
    .checkout-actions {
        
    }
}
</style>