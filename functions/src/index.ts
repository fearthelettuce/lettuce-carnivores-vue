import {onCall, onRequest } from 'firebase-functions/v2/https'
import { log } from 'firebase-functions/logger'
import type { CallableRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import Stripe from 'stripe'
const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY")
const stripeWebhookSecretKey = defineSecret("STRIPE_WEBHOOK_SECRET_KEY")
import admin from 'firebase-admin'
import { Plant, PlantCategory } from './types/Plants'
import { FunctionResponse } from './types/Functions'
import { CartItem, Discount } from './types/Orders'
import { type CustomerRecord } from './types/Users'
import { discountedShippingThreshold, discountedStandardShippingId, discountedExpeditedShippingId, standardShippingId, expeditedShippingId} from './constants/stripeConstants'
import { StripeLineItem } from './types/Stripe'

admin.initializeApp()

interface CheckoutSessionRequest extends CallableRequest {
    data: {
        cart: CartItem[],
        returnUrl: string,
        cancelUrl: string,
        stripeCustomer: CustomerRecord | undefined
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
        request.data.cancelUrl,
        request.data.stripeCustomer,
    )
    if(checkoutSession === null) {
       return {success: false, error: true, message: 'Error creating checkout session', errorDetails: null, data: null}
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create(checkoutSession)
    await admin.firestore().collection(`customers/${uid}/checkout_sessions`).doc().set(stripeCheckoutSession)

    await admin.firestore().collection(`checkoutSessions`).doc(stripeCheckoutSession.id).set({sessionResponse: stripeCheckoutSession, lineItems: checkoutSession.line_items})
    return {success: true, error: false, message: 'Success', errorDetails: null, data: stripeCheckoutSession}

})

async function buildCheckoutSession (cartItems: CartItem[], uid: string, returnUrl: string, cancelUrl: string, stripeCustomer: CustomerRecord | undefined) {
    const stripeCart = await buildStripeCart(cartItems)
    if(!stripeCart || !stripeCart.data) {
        return null
    }
    const cartTotal = (stripeCart.data as CartItem[]).reduce(
        (accumulator, cartItem) => accumulator + (cartItem.price * cartItem.quantity), 0)

    let shippingOptions
    
    if(cartTotal >= discountedShippingThreshold) {
        shippingOptions = [{shipping_rate: discountedStandardShippingId}, {shipping_rate: discountedExpeditedShippingId}]
    } else {
        shippingOptions = [{shipping_rate: standardShippingId}, {shipping_rate: expeditedShippingId}]
    }
    const lineItems: StripeLineItem[] = (stripeCart.data as CartItem[]).map((item: CartItem) => {
        return {
            price_data: {
                currency: 'usd',
                unit_amount: item.price,
                product_data: {
                    name: item.name,
                    description: item.size,
                    metadata: {
                        sku: item.sku,
                        categoryId: item.categoryId,
                        clone: item.clone,
                        size: item.size,
                        isRepresentative: item.isRepresentative,
                    },
                    tax_code: 'txcd_99999999',
                }
            }, 
            quantity: item.quantity
        }
    })

    const session: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        client_reference_id: uid,
        tax_id_collection: {enabled: true},
        success_url: returnUrl,  //not allowed when we switch to embedded
        // return_url: returnUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
            allowed_countries: ['US']
        },
        shipping_options: shippingOptions,
        automatic_tax: {enabled: true},
        discounts: [],
        locale: 'auto',
        ui_mode: 'hosted',
        line_items: lineItems,
    }
    if(stripeCustomer && stripeCustomer.stripeId !== '') {
        session.customer = stripeCustomer.stripeId,
        session.customer_update = {
            shipping: 'auto',
            address: 'auto',
            name: 'auto',
        }
    }
    const discounts = await getDiscounts(session)
    if(discounts !== null && discounts && discounts.stripeDiscounts.length !== 0){
        session.discounts = discounts.stripeDiscounts
    }
    return session
}

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

async function getDiscounts(cartSession: Stripe.Checkout.SessionCreateParams){
    const discountDocs = await getAllDocs('discounts')
    if(!discountDocs || discountDocs.length === 0 || !cartSession.line_items || cartSession.line_items.length === 0) {
        return null
    }
    const activeDiscounts: Discount[] = discountDocs.filter(item => item.valid && item.validThrough.toMillis() >= admin.firestore.Timestamp.now().toMillis()) as Discount[]
    const stripeDiscounts: {coupon: string}[] = []
    const discountValues: Discount[] = []

    const multiPlantDiscount = activeDiscounts.find(item => item.type === 'multiplePlants')
    const cartQuantity = cartSession.line_items.reduce(
        (accumulator, item) => accumulator + item.quantity!,
        0
      );
    if(multiPlantDiscount && cartQuantity >= multiPlantDiscount.parameters.minimumQuantity) {
        stripeDiscounts.push({coupon: multiPlantDiscount.id})
        discountValues.push(multiPlantDiscount)
    }

    const siteWideDiscount = activeDiscounts.find(item => item.type === 'siteWide')
    if(siteWideDiscount && siteWideDiscount.id !== null) {
        stripeDiscounts.push({coupon: siteWideDiscount.id})
        discountValues.push(siteWideDiscount)
    }
    return {
        stripeDiscounts: stripeDiscounts,
        discountValues: discountValues
    }
}


type PlantDetailsFromFirestoreRequest = {
    collection: string,
    items: CartItem[] | {categoryId: string}[]
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

export const stripeWebhookController = onRequest({secrets: [stripeSecretKey, stripeWebhookSecretKey]}, async(req, res): Promise<any> => {
    if(!stripeWebhookSecretKey.value() || stripeWebhookSecretKey.value().length === 0) {
        return res.status(400).send('Unable to get stripe secret key')
    }
    const stripe = new Stripe(stripeSecretKey.value())
    if(!req || !req.headers || !req.headers['stripe-signature']) {
        log('Request missing stripe webhook headers')
        return res.status(400).send('Request missing stripe webhook headers')
    }
    let signature = req.headers["stripe-signature"]
    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            stripeWebhookSecretKey.value()
        )
    } catch (e: any) {
        log('Webhook signature failed')
        return res.status(400).send('Webhook signature failed')
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        await fulfillCheckout(event.data.object)
        log(event.data.object)
    }
    res.status(200).send()
})

async function fulfillCheckout (checkoutWebhookData: any) {
    const checkoutSession = await admin.firestore().collection(`checkoutSessions`).doc(checkoutWebhookData.id).get()
    if(!checkoutSession || checkoutSession === undefined || checkoutSession.data() === undefined) {
        return
    }
    const lineItems = checkoutSession.data()!.lineItems as StripeLineItem[]
    const selectedShipping = checkoutWebhookData.shipping_cost.shipping_rate
    let shippingType
    if(selectedShipping === standardShippingId || selectedShipping === discountedStandardShippingId) {
        shippingType = 'Standard'
    } else {
        shippingType = 'Expedited'
    }
    const orderNumber = await getNextSequentialId('orders')
    const orderDetails = {
        id: orderNumber,
        customer: checkoutWebhookData.client_reference_id,
        orderDate: new Date(),
        checkoutSessionId: checkoutWebhookData.id,
        paymentStatus: checkoutWebhookData.payment_status,
        shippingInfo: {
            address: checkoutWebhookData.shipping_details.address, 
            name: checkoutWebhookData.shipping_details.name,
            email: checkoutWebhookData.customer_details.email,
            phone: checkoutWebhookData.customer_details.phone,
            shippingType: shippingType
        },
        orderStatus: {
            status: 'Processing',
            trackingNumber: '',
            carrier: '',
        },
        lineItems: lineItems,
        cartTotal: {
            amountTotal: checkoutWebhookData.amount_total,
            ...checkoutWebhookData.total_details,
        },
        fullResponse: checkoutWebhookData,
    }
    await admin.firestore().collection(`orders`).doc(orderNumber.toString()).set(orderDetails).catch((e: any) => {log(e)})
    await admin.firestore().collection(`customers/${checkoutWebhookData.client_reference_id}/orders`).doc(orderNumber.toString()).set(orderDetails).catch((e: any) => {log(e)})
    await updateInventory(lineItems).catch((e: any) => {log(e)})
    return
}

async function updateInventory(items: StripeLineItem[]) {
    for (const item of items) {
        const quantity = item.quantity
        const docRef = admin.firestore().doc(`plantCategories/${item.price_data.product_data.metadata.categoryId}`)
        const doc = await docRef.get().catch((e: any) => log(e))

        if(!doc || !doc.data()){
            log(`Error getting doc ${docRef.toString()}`)
            log(`${item}`)
            return
        }
        const plantCategory = doc.data()!
        const plantIndex = plantCategory.plants.findIndex((plant: Plant) => plant.sku === item.price_data.product_data.metadata.sku)

        if(plantCategory.plants[plantIndex].quantity === 1) {
            plantCategory.plants[plantIndex].status = 'Sold'
            plantCategory.plants[plantIndex].quantity = 0
        } else {
            if(quantity > plantCategory.plants[plantIndex].quantity) {
                plantCategory.plants[plantIndex].quantity = 0
                log(`Plant ${plantCategory.plants[plantIndex].sku} quantity ${plantCategory.plants[plantIndex].quantity} less than cart quantity ${quantity}`)
            } else {
                plantCategory.plants[plantIndex].quantity = plantCategory.plants[plantIndex].quantity - quantity
            }
        }
        await docRef.update({plants: plantCategory.plants})
    }
    return
}

async function getNextSequentialId(collectionName: string, idFieldName: string = 'id') {
    const startingValue = 1000
    let docs: Array<unknown> | undefined = []
    try {
        docs = await getAllDocs(collectionName)
    } catch (err) {
        console.log(err)
    }
    let nextSequentialId: number
    if (docs.length > 0) {
        nextSequentialId = await docs.reduce((acc: number, doc: any) => acc = acc > parseInt(doc[idFieldName]) ? acc : parseInt(doc[idFieldName]), startingValue).valueOf()
        nextSequentialId++ 
    } else {
        return startingValue + 1
    }
    return nextSequentialId
}

async function getAllDocs(collectionName: string) {
    const snapshot = await admin.firestore().collection(collectionName).get()
    return snapshot.docs.map(doc => doc.data())
}