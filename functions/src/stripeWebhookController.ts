import admin from 'firebase-admin'
import { error, log } from 'firebase-functions/logger'
import { onRequest } from 'firebase-functions/v2/https'

import { StripeLineItem } from './types/Stripe'
import Stripe from 'stripe'
import { discountedStandardShippingId, standardShippingId } from './constants/stripeConstants'
import { defineSecret } from 'firebase-functions/params'
import { getNextSequentialId } from './common'
import { updateInventoryFromStripeSale } from './inventory/inventoryService'
const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY")
const stripeWebhookSecretKey = defineSecret("STRIPE_WEBHOOK_SECRET_KEY")

export default onRequest({secrets: [stripeSecretKey, stripeWebhookSecretKey]}, async(req, res): Promise<any> => {
    if(!stripeWebhookSecretKey.value() || stripeWebhookSecretKey.value().length === 0) {
        return res.status(400).send('Unable to get stripe secret key')
    }
    const stripe = new Stripe(stripeSecretKey.value())
    if(!req || !req.headers || !req.headers['stripe-signature']) {
        error('Request missing stripe webhook headers')
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
        error('Webhook signature failed')
        return res.status(400).send('Webhook signature failed')
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        await fulfillCheckout(event.data.object)
        log(event.data.object)
    }
    res.status(200).send()
})

async function fulfillCheckout (data: any) {
    const checkoutSession = await admin.firestore().collection(`checkoutSessions`).doc(data.id).get()
    if(!checkoutSession || checkoutSession === undefined || checkoutSession.data() === undefined) {
        return
    }
    const lineItems = checkoutSession.data()!.lineItems as StripeLineItem[]
    const selectedShipping = data.shipping_cost.shipping_rate
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
        customer: data.client_reference_id,
        orderDate: new Date(),
        checkoutSessionId: data.id,
        paymentStatus: data.payment_status,
        shippingInfo: {
            address: data.shipping_details.address,
            name: data.shipping_details.name,
            email: data.customer_details.email,
            phone: data.customer_details.phone,
            shippingType: shippingType
        },
        orderStatus: {
            status: 'Processing',
            trackingNumber: '',
            carrier: '',
        },
        lineItems: lineItems,
        cartTotal: {
            amountTotal: data.amount_total,
            ...data.total_details,
        },
        fullResponse: data,
    }
    await admin.firestore().collection(`orders`).doc(orderNumber.toString()).set(orderDetails).catch((e: any) => {log(e)})
    await admin.firestore().collection(`customers/${data.client_reference_id}/orders`).doc(orderNumber.toString()).set(orderDetails).catch((e: any) => {log(e)})
    await updateInventoryFromStripeSale(lineItems)
    return
}
