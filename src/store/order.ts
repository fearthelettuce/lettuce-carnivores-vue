import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type{ CartItem, ShoppingCart } from '@/types/Orders'
import { newShoppingCart } from '@/constants/OrderConstants'
import { usePlantStore } from '../components/modules/products/stores/plant'
import { type PlantCategory } from '@/types/Plant'
import { useLocalStorage } from '@vueuse/core'
import {getActiveProducts, getProductBySku, createCheckoutSession} from '@/apis/stripe'

import type { StripeCartItem } from '@/types/Orders';

export const useOrderStore = defineStore('order', () => {
    const isLoading = ref(false)
    const cart: Ref<ShoppingCart> | undefined = ref(useLocalStorage('cart',{...newShoppingCart}))
    const stripeCart: Ref<StripeCartItem[]> = ref([])
    const cartItemCount = computed(() => {
        const cartCount = cart.value.cartItems.reduce(
            (accumulator, cartItem) => accumulator + cartItem.quantity,
            0
          );
        return cartCount
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
                return {success: true}
            } 
            if (cart?.value.cartItems[cartIndex].quantity < plant.quantity) {
                cart.value.cartItems[cartIndex].quantity ++
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
                return
            }
            if(cart.value.cartItems[cartIndex].quantity > 1) {
                cart.value.cartItems[cartIndex].quantity --
                return
            } 
            if(cart.value.cartItems[cartIndex].quantity = 1) {
                cart.value.cartItems.splice(cartIndex,1)
                return
            } 
        }
    }

    function resetCart () {
        if(cart && cart.value) {
            cart.value.cartItems.length = 0
        }
    }
    async function startCheckoutSession () {
        await buildStripeCart()
        //if(stripeCart.value.length !== cart?.value.cartItems.length) {
        console.log({...stripeCart.value})
        if(stripeCart.value.length !== cart?.value.cartItems.length) {
            console.table(stripeCart.value)
            console.table(cart?.value.cartItems)
            return {success: false, error: true, message: `Unable to create checkout session`}
        }
        await createCheckoutSession(stripeCart.value)
    }

    async function buildStripeCart () {
        isLoading.value = true
        stripeCart.value.length = 0
        if(!cart || !cart.value || cart.value.cartItems.length === 0) {
            return
        }
        for(const item of cart?.value.cartItems) {
        // cart?.value.cartItems.forEach(async (item) => {
            try {
                //const product = await getProductBySku(item.sku)
                const product = await getProductBySku(item.sku)
                stripeCart.value.push({...product, quantity: item.quantity})
                
            } catch (e: any) {
                return {success: false, error: true, message: `Unable to create checkout session, \n ${e.message}`}
            }
        }
        // if(cart && cart.value) {
        //     const product = await getProductBySku(cart?.value.cartItems[0].sku)
        //     console.log(product)
        // }
       console.log(stripeCart.value)
       isLoading.value = false
       
    }


    return { cart, cartItemCount, getCategoryBySku, addItemToCart, removeItemFromCart, startCheckoutSession, resetCart}
})
