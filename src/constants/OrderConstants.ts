import type { ShoppingCart } from '@/types/Orders'
export const newShoppingCart: ShoppingCart = {
    cartItems: [],
}
const standardFreeShippingThreshold = 75
const coldWeatherFreeShippingThreshold = 150
export const isColdWeatherShippingActive = true
export const discountedShippingThreshold = isColdWeatherShippingActive ? coldWeatherFreeShippingThreshold : standardFreeShippingThreshold
