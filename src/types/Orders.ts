import type { Timestamp } from 'firebase/firestore'
import type { Sizes } from './Plant'
import type { PhotoItem } from './Product'

export type ShoppingCart = {
    cartItems: CartItem[],
}

export type CartItem = {
    sku: string,
    plantCategoryId: string | number,
    categoryId: string | number,
    quantity: number,
    maxQuantity: number,
    price: number,
    name: string,
    clone: string,
    photo: PhotoItem,
    size: Sizes,
    isDiscounted: boolean,
    isRepresentative: boolean,

}
//export type StripeCartItem = StripeProduct & {quantity: number}

export type StripeProduct = {
    active: boolean,
    description: string,
    images: string[],
    metadata: {sku: string | number},
    name: string,
    role: null,
    stripe_metadata_sku: string | number,
    tax_code: string,
    price: StripePrice,
    shippable?: boolean,
    id?: string,
}
export type StripePrice = {
    active: boolean,
    billing_scheme: string,
    currency: "usd",
    description: string | null,
    interval: string | null,
    interval_count: null,
    metadata: {},
    product: string,
    recurring: null,
    tax_behavior: string,
    tiers: null,
    tiers_mode: null,
    transform_quantity: null,
    trial_period_days: null,
    type: string,
    unit_amount: number,
    id: string,
}

export type StripeCartItem = {
    priceId: string,
    quantity: number
}

export type Order = {
    id: number,
    cartTotal: {
        amountTotal: number,
        amount_shipping: number,
        amount_discount: number,
        amount_tax: number,
    },
    checkoutSessionId: string,
    customer: string,
    lineItems: {
        quantity: number,
        price_data: {
            unit_amount: number,
            product_data: {
                description: string,
                name: string,
                metadata: {
                    categoryId: number,
                    sku: string,
                    clone: string,
                    size: string,
                    isRepresentative: boolean,
                },
            },
        },
    }[],
    orderDate: Timestamp,
    orderStatus: {
        carrier: 'UPS' | 'USPS' | 'FedEx' | 'LocalPickup',
        status: 'Pending' | 'Shipped' | 'Shipping Scheduled' | 'Complete',
        trackingNumber: string
    },
    shippingInfo: {
        address: {
            line1: string,
            line2: string | null, 
            city: string,
            state: string,
            postal_code: string
        },
        name: string,
        email: string,
        shippingType: 'Standard' | 'Expedited'
    },
    fullResponse: any,
}

export type Discount = {
    id: string,
    amount_off: number,
    percent_off: number,
    valid: boolean,
    parameters: {
        minimumQuantity: number,
    },
    validThrough: Timestamp,
    type: string,
    duration: string,
    message: string,
}