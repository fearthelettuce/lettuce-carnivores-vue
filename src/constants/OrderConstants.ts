import { type ShippingDetails, type ShoppingCart } from '@/types/Orders'
export const freeShipping: ShippingDetails = {label: 'Free Standard Shipping!', type: 'standard', isDiscounted: true, stripeProduct: null, stripePrice: 'price_1Pf3NKHlHApXEku98z5rdvcJ', value: 0}
export const freeUpgraded: ShippingDetails = {label: 'Upgrade to Expedited Shipping', type: 'expedited', isDiscounted: true, stripeProduct: 'prod_QW4gESRi0oD5P4', stripePrice: 'price_1PerTsHlHApXEku9y85PNiVm', value: 4}
export const standardShipping: ShippingDetails = {label: 'Standard Shipping',  type: 'standard', isDiscounted: false, stripeProduct: 'prod_QVt4jZz99DvKsl', stripePrice: 'price_1PerI3HlHApXEku9Yj3zT6ng', value: 8}
export const expeditedShipping: ShippingDetails = {label: 'Expedited Shipping', type: 'expedited', isDiscounted: false, stripeProduct: 'prod_QVtGzMGXT8HjtR', stripePrice: 'price_1Pf2XBHlHApXEku9izGcR5XH', value: 12}

export const newShoppingCart: ShoppingCart = {
    id: undefined,
    cartItems: [],
    shipping: standardShipping as ShippingDetails
}

export const discountedShippingThreshold = 75