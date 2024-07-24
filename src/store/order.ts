import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type{ CartItem, ShoppingCart } from '@/types/Orders'
import { discountedShippingThreshold, expeditedShipping, freeShipping, freeUpgraded, newShoppingCart, standardShipping } from '@/constants/OrderConstants'
import { usePlantStore } from '../components/modules/products/stores/plant'
import { type PlantCategory } from '@/types/Plant'
import { useLocalStorage } from '@vueuse/core'
import {createStripeCheckoutSession} from '@/apis/stripe'

import type { StripeCartItem } from '@/types/Orders';
import { useUserStore } from '@/components/modules/auth/stores/users'

export const useOrderStore = defineStore('order', () => {
    const isLoading = ref(false)
    const cart: Ref<ShoppingCart> = ref(useLocalStorage('cart',{...newShoppingCart}))
    const stripeCart: Ref<StripeCartItem[]> = ref([])
    const cartItemCount = computed(() => {
        const cartCount = cart.value.cartItems.reduce(
            (accumulator, cartItem) => accumulator + cartItem.quantity,
            0
          );
        return cartCount
    })
    const cartTotal = computed(() => {
        return cart.value.cartItems.reduce(
            (accumulator, cartItem) => accumulator + (cartItem.price * cartItem.quantity), 0)
    })
    const addItemToCart = async (item: CartItem) => {
        const cartIndex = cart?.value.cartItems.findIndex(cartItem => cartItem.sku === item.sku)
        if(cart && cartIndex !== undefined) {
            const {category, plant} = await getCategoryBySku(item)
            console.log(plant)
            const cartItem = cart.value.cartItems[cartIndex]
            if(!plant|| plant.quantity === 0) {
                return {success: false, error: true, errorMessage: 'Unable to add to cart, quantity not available'}
            }
            if(cartIndex === -1) {
                cart.value.cartItems.push(item)
                updateShipping()
                return {success: true}
            } 
            if (cart?.value.cartItems[cartIndex].quantity < plant.quantity) {
                cart.value.cartItems[cartIndex].quantity ++
                updateShipping()
                return {success: true}
            } else {
                return {success: false, error: true, errorMessage: 'Unable to add to cart, quantity not available'}
            }
        }
        return {success: false, error: true, errorMessage: 'Unable to get cart'}
    }


    const getCategoryBySku = async (item: CartItem) => {
        try {
            const category: PlantCategory = await usePlantStore().findPlantCategoryById(item.categoryId)
            const plant = category.plants.find(plantItem => plantItem.sku === item.sku)
            return {category, plant}
        } catch (e: any) {
            console.error(e)
            throw new Error('Unable to add to cart')
        }
    }

    const removeItemFromCart = (item: CartItem, deleteItem: boolean) => {
        const cartIndex = cart?.value.cartItems.findIndex(cartItem => cartItem.sku === item.sku)
        if(cart && cartIndex !== -1 && cartIndex !== undefined) {
            if(deleteItem) {
                cart.value.cartItems.splice(cartIndex,1)
                updateShipping()
                return
            }
            if(cart.value.cartItems[cartIndex].quantity > 1) {
                cart.value.cartItems[cartIndex].quantity --
                updateShipping()
                return
            } 
            if(cart.value.cartItems[cartIndex].quantity = 1) {
                cart.value.cartItems.splice(cartIndex,1)
                updateShipping()
                return
            } 
        }
    }

    function resetCart () {
        if(cart && cart.value) {
            cart.value.cartItems.length = 0
            updateShipping()
        }
    }

    function updateShipping() {
        if(!cart.value.shipping || !cart.value.shipping.type) {
            cart.value.shipping = standardShipping
        }
        const currentShippingType = cart?.value.shipping.type
        if(cartTotal.value >= discountedShippingThreshold) {
            if(currentShippingType === 'standard' || !currentShippingType) {
                cart.value.shipping = freeShipping
                
            } else {
                cart.value.shipping = freeUpgraded
            }
        } else {
            if(currentShippingType === 'standard' || !currentShippingType) {
                cart.value.shipping = standardShipping
            } else {
                cart.value.shipping = expeditedShipping
            }
        }
    }

    const shippingOptions = computed(() => {
        if(cartTotal.value >= discountedShippingThreshold) {
            return [freeShipping, freeUpgraded]
        } else {
            return [standardShipping, expeditedShipping]
        }
    })


    async function startCheckoutSession() {
        isLoading.value = true
        try{
            const session = await createStripeCheckoutSession(cart.value.cartItems)
            console.log(session.data.data)
            console.log(session.data.data.url)
            return {success: true, error: false, message: `Success`, data: session.data.data}
        } catch (e: any) {
            console.error(e)
            return {success: false, error: true, message: `Unable to create checkout session`}
        } finally {
            //setTimeout(() => {isLoading.value = false}, 4000)
            isLoading.value = false
        }
    }


    return { cart, cartItemCount, getCategoryBySku, addItemToCart, removeItemFromCart, startCheckoutSession, resetCart, cartTotal, shippingOptions, updateShipping, isLoading}
})
