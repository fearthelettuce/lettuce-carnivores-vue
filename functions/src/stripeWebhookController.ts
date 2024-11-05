import admin from 'firebase-admin'
import { log } from 'firebase-functions/logger'
import { onRequest } from 'firebase-functions/v2/https'

import type { Plant } from './types/Plants'
import { StripeLineItem } from './types/Stripe'
import Stripe from 'stripe'
import { discountedStandardShippingId, standardShippingId } from './constants/stripeConstants'
import { defineSecret } from 'firebase-functions/params'
import { getNextSequentialId } from './common'
import { deleteEbayInventoryItem } from './ebay/ebayData'
const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY")
const stripeWebhookSecretKey = defineSecret("STRIPE_WEBHOOK_SECRET_KEY")

export default onRequest({secrets: [stripeSecretKey, stripeWebhookSecretKey]}, async(req, res): Promise<any> => {
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
    if(typeof orderNumber !== 'number') {
        throw new Error('Unable to get next order ID')
    }
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
        const data = item.price_data.product_data.metadata
        await deleteEbayInventoryItem(data.sku)
        const quantity = item.quantity
        const docRef = admin.firestore().doc(`plantCategories/${data.categoryId}`)
        const doc = await docRef.get().catch((e: any) => log(e))

        if(!doc || !doc.data()){
            log(`Error getting doc ${docRef.toString()}`)
            log(`${item}`)
            return
        }
        const plantCategory = doc.data()!
        const plantIndex = plantCategory.plants.findIndex((plant: Plant) => plant.sku === data.sku)

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
