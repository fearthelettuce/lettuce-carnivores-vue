import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type{ CartItem, ShoppingCart } from '@/types/Orders'
import { newShoppingCart } from '@/constants/OrderConstants'
import { usePlantStore } from '../components/modules/products/stores/plant'
import { type PlantCategory } from '@/types/Plant'
import { useLocalStorage } from '@vueuse/core'
import {createStripeCheckoutSession} from '@/apis/stripe'
import { getPlantsFromFirestore } from '@/apis/dataServices'

export const useOrderStore = defineStore('order', () => {
    const isLoading = ref(false)
    const cart: Ref<ShoppingCart> = ref(useLocalStorage('cart',{...newShoppingCart}))
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
            const {plant} = await getCategoryBySku(item)
            console.log(plant)
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

    async function startCheckoutSession() {
        isLoading.value = true
        try{
            const session = await createStripeCheckoutSession(cart.value.cartItems)
            return {success: true, error: false, message: `Success`, data: session.data.data}
        } catch (e: any) {
            console.error(e)
            return {success: false, error: true, message: `Unable to create checkout session`}
        } finally {
            isLoading.value = false
        }
    }



    async function validateCart() {
        const plantData = await getPlantsFromFirestore(cart.value.cartItems)
        let errors = ''
        cart.value.cartItems.forEach((item, index) => {
            const dbPlant = plantData.find((plant) => plant.sku === item.sku)
            if(!dbPlant || dbPlant.status !== 'In Stock' || dbPlant.quantity === 0) {
                cart.value.cartItems.splice(index, 1)
                errors = errors + `${item.name} - ${item.sku}: this item is no longer available and has been removed from your cart.\n`
                return
            }
            if(item.quantity > dbPlant.quantity) {
                cart.value.cartItems[index].quantity = dbPlant.quantity
                errors = errors + `${item.name} - ${item.sku}: The requested quantity is no longer available, your cart has been adjusted.\n`
            }
        })
        return errors
    }

    return { 
        cart, 
        cartItemCount, 
        getCategoryBySku, 
        addItemToCart, 
        removeItemFromCart,
        validateCart,
        resetCart,
        startCheckoutSession, 
        cartTotal, 
        isLoading
    }
})
