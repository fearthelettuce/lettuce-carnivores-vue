<template>
  <div v-if="cartErrors !== null" class="mx-5 alert alert-warning mb-3">
    {{ cartErrors }}
  </div>
  <div class="container mb-3">
    <div class="d-flex justify-content-center" v-if="cart.cartItems.length === 0">
      <p>Cart is empty</p>
    </div>

    <div class="cart-grid" v-else>
      <div class="cart-item-container">
        <ShoppingCartItem 
          v-for="item in cart.cartItems" 
          :key="item.sku" 
          :item @cart-items-changed="updateDiscounts"
          :discountedPrice="getDiscountedPrice(item)"
        />
      </div>
      <div class="subtotal-container">
        <div class="subtotal">
          <div v-if="totalDiscountAmount > 0" class="subtotal-line">
            <h3 class="m-0">Discount</h3>
            <h3 class="m-0">
              {{ USDollar.format(-totalDiscountAmount) }}
            </h3>
          </div>
          <div class="subtotal-line">
            <h3 class="m-0">Subtotal</h3>
            <h3 class="m-0">
              {{ USDollar.format(cartSubtotal) }}
            </h3>
          </div>

          <div v-if="activeDiscountMessage !== null" class="d-flex flex-row justify-content-center gap-2 mx-4">
            <h5 class="center-message">
              {{ activeDiscountMessage }}
            </h5>
          </div>

          <div class="d-flex flex-row justify-content-center gap-2 mx-4">
            <h5 class="center-message">
              {{
                cartTotal - totalDiscountAmount >= discountedShippingThreshold
                  ? `Free standard shipping on orders over $75!`
                  : `Add ${amountToQualifyForDiscountedShipping} to quality for free standard shipping.`
              }}
            </h5>
          </div>
        </div>
      </div>
      <footer class="footer sticky-bottom">
        <div class="checkout-actions">
          <button v-if="!isLoggedIn" class="btn btn-info btn-lg text-white" @click="router.push('/login')">Login</button>

          <button class="checkout-button" @click.prevent="checkout" :disabled="cart.cartItems.length === 0 || isCheckoutLoading">
            {{ isLoggedIn ? `Checkout` : `Checkout as Guest` }}
            <span class="spinner-border" role="status" v-show="isCheckoutLoading"></span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/order'
import { ref, type Ref, computed, onMounted } from 'vue'
import type { CartItem, Discount } from '@/types/Orders'
import { toast } from 'vue3-toastify'
import { discountedShippingThreshold } from '@/constants/OrderConstants'
import { useUserStore } from '@/stores/users'
import { router } from '@/router'
import { USDollar } from '@/utils/utils';
import ShoppingCartItem from './ShoppingCartItem.vue'

const { cart, discountedItems } = storeToRefs(useOrderStore())
const { getCategoryBySku, startCheckoutSession, validateCart, applyDiscounts } = useOrderStore()
const { cartTotal, isLoading } = storeToRefs(useOrderStore())
const { loginAnonymously, isLoggedIn, isUserLoading, user } = useUserStore()


const amountToQualifyForDiscountedShipping = computed(() => {
  if (cartTotal.value - totalDiscountAmount.value >= discountedShippingThreshold) {
    return USDollar.format(0)
  } else {
    return USDollar.format(discountedShippingThreshold - cartTotal.value + totalDiscountAmount.value)
  }
})
const cartSubtotal = computed(() => {
  return cartTotal.value - totalDiscountAmount.value
})
const totalDiscountAmount = ref(0)

onMounted(async () => {
  await getCartErrors()
  await updateDiscounts()
  totalDiscountAmount.value = await applyDiscounts()
  cart.value.cartItems.forEach((item) => getCategoryBySku(item))
})

const isCheckoutLoading = computed(() => {
  return isLoading.value || isUserLoading
})

const { activeDiscountMessage } = storeToRefs(useOrderStore())
async function updateDiscounts() {
  totalDiscountAmount.value = await applyDiscounts()
}

function getDiscountedPrice(item: CartItem) {

  const index = discountedItems.value?.findIndex(discountedItem => discountedItem.sku === item.sku)
    
  console.log(index)
  if (index === -1 || index === undefined ||  discountedItems.value === null) { return undefined }
  return discountedItems.value[index]?.priceAfterDiscount ?? undefined
}

async function checkout() {
  await getCartErrors()
  if (cartErrors.value !== null) {
    toast.error('Some items are no longer available, please review cart and try again')
    return
  }
  if (!user || user === null) {
    await loginAnonymously()
  }
  if (cart.value.cartItems.length > 0) {
    const res = await startCheckoutSession()
    if (!res || res.error === true || !res.data.url) {
      console.error(res)
      toast.error(res?.message || 'Unable to open checkout page')
      return
    }
    window.location.replace(res.data.url)
  }
}
const cartErrors: Ref<string | null> = ref(null)
async function getCartErrors() {
  cartErrors.value = null
  const errors = await validateCart()
  if (errors !== '') {
    cartErrors.value = errors
  }
}
</script>

<style scoped lang="scss">

.center-message {
  margin: 0.5rem 0;
  text-align: center;
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
  background: var(--bs-body-bg);
  filter: brightness(85%);
  padding: 0.5rem 0.5rem;
  border-radius: 0.6rem;
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
  margin-bottom: 2rem;
}
.checkout-button {
  border-radius: 0.5rem;
  background: linear-gradient(0.15turn, #ffbf46, #fccb72, #ffbf46);
  padding: 0.5rem 1.25rem;
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
  background: linear-gradient(0.4turn, #9fdb50, #a1c181, #9fdb50);
  //background: linear-gradient(0.4turn, #9fdb50, #ebf8e1, #3f87a6);
  padding: 0.6rem 0;
  border-radius: 1rem;
}

@media (min-width: 60rem) {
  .cart-item-container {
    padding: 1rem 1rem;
  }
}
</style>
