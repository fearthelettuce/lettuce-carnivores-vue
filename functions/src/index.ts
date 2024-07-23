import {onCall} from 'firebase-functions/v2/https'
const { defineSecret } = require('firebase-functions/params');
export const createProductInStripe = onCall(async(request) => {
    const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY");
    const stripe = require('stripe')(stripeSecretKey.value())
    const stripeProduct = request.data
    try {
        const product = await stripe.products.create(stripeProduct)
        return {success: true, error: false, message: 'Product created successfully', errorDetails: null, data: product}
    } catch (e: any) {
        console.log(e)
        return {success: false, error: true, message: 'Error creating product', errorDetails: e, data: null}
    }

})
