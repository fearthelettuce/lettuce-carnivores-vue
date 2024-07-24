import {onCall} from 'firebase-functions/v2/https'
import type { CallableRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import Stripe from 'stripe'
const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY")
//const stripeWebhookSecretKey = defineSecret("STRIPE_WEBHOOK_SECRET_KEY")
interface CheckoutSessionRequest extends CallableRequest {
    data: {
        cart: CartItem[],
        returnUrl: string,
        cancelUrl: string,
    },
}
export const createCheckoutSession = onCall({secrets: [stripeSecretKey]},async(request: CheckoutSessionRequest): Promise<FunctionResponse> => {
    if(!stripeSecretKey.value() || stripeSecretKey.value().length === 0) {
        return {success: false, error: true, message: 'Unable to get stripe API key', errorDetails: null, data: null}
    }
    const stripe = new Stripe(stripeSecretKey.value())
    const uid = request.auth?.uid
    if(!uid || !request.auth || request.data.cart.length === 0) {
        return {success: false, error: true, message: 'Unable to create checkout session', errorDetails: null, data: null}
    }
    const checkoutSession = await buildCheckoutSession(
        request.data.cart, 
        uid, 
        request.data.returnUrl, 
        request.data.cancelUrl
    )
    if(checkoutSession === null) {
       return {success: false, error: true, message: 'Error creating checkout session', errorDetails: null, data: null}
    }
    //create checkout_session doc in customers
    //@ts-ignore
    const stripeCheckoutSession = await stripe.checkout.sessions.create(checkoutSession)
    return {success: true, error: false, message: 'Success', errorDetails: null, data: stripeCheckoutSession}

})

async function buildCheckoutSession (cartItems: CartItem[], uid: string, returnUrl: string, cancelUrl: string,) {
    const stripeCart = await buildStripeCart(cartItems)
    if(!stripeCart || !stripeCart.data) {
        return null
    }
    const cartTotal = (stripeCart.data as CartItem[]).reduce(
        (accumulator, cartItem) => accumulator + (cartItem.price * cartItem.quantity), 0)
    const shippingRates = {
        standard: 800,
        expedited: 1200
    }

    if(cartTotal >= 7500) {
        shippingRates.standard = 0
        shippingRates.expedited = 400
    }
    const lineItems = (stripeCart.data as CartItem[]).map((item: CartItem) => {
        return {
            price_data: {
                currency: 'usd',
                unit_amount: item.price,
                product_data: {
                    name: item.name,
                    description: item.size,
                    metadata: {
                        sku: item.sku
                    },
                    tax_code: 'txcd_99999999',
                }
            }, 
            quantity: item.quantity
        }
    })

    const session = {
        mode: 'payment',
        client_reference_id: uid,
        // customer: uid,
        // customer: 'cus_QVIvtyYoNcHKr7',
        // customer_update: {
        //     name: 'auto',
        //     shipping: 'auto',
        // },
        tax_id_collection: {enabled: true},
        success_url: returnUrl,  //not allowed when we switch to embedded
        // return_url: returnUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
            allowed_countries: ['US']
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Standard Shipping',
                    fixed_amount: {
                        amount: shippingRates.standard,
                        currency: 'usd',
                    },
                    tax_behavior: 'exclusive',
                    tax_code: 'txcd_92010001',
                    type: 'fixed_amount'
                },
            },
            {
                shipping_rate_data: {
                    display_name: 'Expedited Shipping',
                    fixed_amount: {
                        amount: shippingRates.expedited,
                        currency: 'usd',
                    },
                    tax_behavior: 'exclusive',
                    tax_code: 'txcd_92010001',
                    type: 'fixed_amount'
                },
                
            },
        ],
        automatic_tax: {enabled: true},
        discounts: [],
        ui_mode: 'hosted',
        line_items: lineItems,
    }
    return session

}
// export const buildStripeCart = onCall(async(request: {data: {cart: [{plantCategory: PlantCategory, plant: Plant }}) => {
//     const plant = request.data.plant
//     const plantCategory = request.data.plantCategory
//     console.log('hi')
// })





import admin from 'firebase-admin'
import { Plant, PlantCategory } from './types/Plants'
import { FunctionResponse } from './types/Functions'
import { CartItem } from './types/Orders'
admin.initializeApp()

async function buildStripeCart (cartItems: CartItem[]): Promise<FunctionResponse> {
    
    if(cartItems.length === 0) {
        return {success: false, error: true, message: 'Cart is empty', errorDetails: null, data: cartItems}
    }
    const stripeCart = cartItems
    const plantDetails = await getPlantDetailsFromFirestore({collection: 'plantCategories', items: stripeCart })
    if(plantDetails === null || plantDetails.length === 0) {
        return {success: false, error: true, message: 'Unable to get product data', errorDetails: null, data: stripeCart}
    }
    for(const item of stripeCart) {
        const plant = plantDetails.find((plant) => item.sku === plant.sku)
        if(!plant) {
            return {success: false, error: true, message: 'Unable to get product data', errorDetails: null, data: stripeCart}
        }
        if(item.quantity > plant.quantity) {
            return {success: false, error: true, message: 'Quantity exceeds available inventory', errorDetails: null, data: stripeCart}
        }
        item.price = plant.price * 100
    }
    return {success: true, error: false, message: 'Success', errorDetails: null, data: stripeCart}
}

type PlantDetailsFromFirestoreRequest = {
    collection: string,
    items: CartItem[]
}

async function getPlantDetailsFromFirestore (request: PlantDetailsFromFirestoreRequest): Promise<Plant[]> {
    const collection = request.collection
    let plants: Plant[] = []
    for (const category of request.items) {
        const docRef = admin.firestore().doc(`${collection}/${category.categoryId}`)
        const snap = await docRef.get().catch((e: any) => console.error(e))
        if(snap && snap.data()) {
            const data = snap.data() as PlantCategory
            plants = plants.concat(data.plants)
        }
    }
    return plants
}