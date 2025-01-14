import type { ShoppingCart } from '@/types/Orders'
export const newShoppingCart: ShoppingCart = {
    cartItems: [],
}
const standardFreeShippingThreshold = 75
const coldWeatherFreeShippingThreshold = 200
export const isColdWeatherShippingActive = true
export const discountedShippingThreshold = isColdWeatherShippingActive ? coldWeatherFreeShippingThreshold : standardFreeShippingThreshold
