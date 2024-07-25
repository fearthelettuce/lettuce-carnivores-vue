export type ShoppingCart = {
    id: number | undefined,
    cartItems: CartItem[],
    shipping: ShippingDetails
}

export type ShippingDetails = {
    type: 'standard' | 'expedited',
    isDiscounted: boolean,
    label: string,
    stripeProduct: 'prod_QVt4jZz99DvKsl' | 'prod_QVtGzMGXT8HjtR' | 'prod_QW4gESRi0oD5P4' | null, //these are test products, need ot update with prod ids
    stripePrice: 'price_1PerI3HlHApXEku9Yj3zT6ng' | 'price_1PerTsHlHApXEku9y85PNiVm' | 'price_1Pf2XBHlHApXEku9izGcR5XH' | 'price_1Pf3NKHlHApXEku98z5rdvcJ',
    value: number,
}

export type CartItem = {
    sku: string,
    plantCategoryId: string,
    categoryId: string,
    quantity: number,
    maxQuantity: number,
    price: number,
    name: string,
    clone: string,
    // photo: PhotoItem,
    size: string,
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