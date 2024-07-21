import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type{ CartItem, ShoppingCart } from '@/types/Orders'
import { discountedShippingThreshold, expeditedShipping, freeShipping, freeUpgraded, newShoppingCart, standardShipping } from '@/constants/OrderConstants'
import { usePlantStore } from '../components/modules/products/stores/plant'
import { type PlantCategory } from '@/types/Plant'
import { useLocalStorage } from '@vueuse/core'
import {getActiveProducts, getProductBySku, createCheckoutSession} from '@/apis/stripe'

import type { StripeCartItem } from '@/types/Orders';

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

    async function startCheckoutSession () {
        isLoading.value = true
        await buildStripeCart()
        if(stripeCart.value.length !== cart.value.cartItems.length + 1) {
            console.table(stripeCart.value)
            console.table(cart?.value.cartItems)
            return {success: false, error: true, message: `Unable to create checkout session`}
        }
        await createCheckoutSession(stripeCart.value)
        setTimeout(() => {isLoading.value = false}, 4000)
        
    }

    async function buildStripeCart () {
        stripeCart.value.length = 0
        if(cart.value.cartItems.length === 0) {
            return
        }
        for(const item of cart?.value.cartItems) {
            try {
                const product = await getProductBySku(item.sku)
                stripeCart.value.push({priceId: product.price.id, quantity: item.quantity})
                
            } catch (e: any) {
                return {success: false, error: true, message: `Unable to create checkout session, \n ${e.message}`}
            }
        }
        stripeCart.value.push({priceId: cart.value.shipping.stripePrice, quantity: 1})
    }
    return { cart, cartItemCount, getCategoryBySku, addItemToCart, removeItemFromCart, startCheckoutSession, resetCart, cartTotal, shippingOptions, updateShipping, isLoading}
})
