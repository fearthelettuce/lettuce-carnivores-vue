import {onRequest} from 'firebase-functions/v2/https'
const { defineSecret } = require('firebase-functions/params');
export const createProductInStripe  = onRequest({cors: true }, async (req: any, res: any) => {
    const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY");
    const stripe = require('stripe')(stripeSecretKey.value())

    try {
        const product = await stripe.products.create(req.body.data)
        res.status(200).json({success: true, message: 'Product added successfully', product}).send()
    } catch (e: any) {
        res.status(500).json({success: false, message: 'Error creating product', e}).send()
    }
    return

})