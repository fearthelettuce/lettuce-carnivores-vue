import admin from 'firebase-admin'
import { onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params'
import type {  EbayAccessTokenRequest, EbayEnvironment, EbayListingRequest } from '../types/Ebay';
import { submitAccessTokenRequest, generateUserConsentUrl, getOrRefreshUserAccessToken } from './ebayService';
import { getListingsData } from './ebayData';

const ebayClientId = defineSecret('EBAY_CLIENT_ID')
const ebayClientSecret = defineSecret('EBAY_SECRET_ID')
const sandboxClientId = defineSecret('EBAY_SANDBOX_CLIENT_ID')
const sandboxClientSecret = defineSecret('EBAY_SANDBOX_CLIENT_SECRET')
let environment: EbayEnvironment
let clientId: string
let clientSecret: string
let accessToken: string
export const getEbayAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}

    const res = await submitAccessTokenRequest(request.data.environment, clientId, clientSecret )
    console.log(res)
    if(res.success && res.data && 'access_token' in res.data) {
        accessToken = res.data.access_token
    } else {
        console.log(res.data)
        return {success: false, error: true, message: 'Unable to get Access Token', errorDetails: res.data}
    }
    return res
})

export const getUserConsent = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: CallableRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    return generateUserConsentUrl(environment, clientId)

})

export const getUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    if(!request.data.authCode) {
        console.log(request.data)
        return {success: false, error: true, message: 'Unable to get auth code', errorDetails: null, data: null}
    }
    const res = await getOrRefreshUserAccessToken(environment,clientId, clientSecret, request.data.authCode)
    .catch(e => {
        console.error(e)
        return {success: false, error: true, errorDetails: e, data: null, message: 'Error getting or refreshing token'}
    })
    return res
})

export const refreshUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    const tokenDoc = environment === 'PRODUCTION' ? 'ebayToken' : 'sandboxToken'
    const snap = await admin.firestore().collection('admin').doc(tokenDoc).get()
    if(!snap || snap === undefined || snap.data() === undefined) {
        console.log(snap)
        return {success: false, error: true, message: 'Unable to get refresh token from db', errorDetails: {}, data: {}}
    }

    const oldRefreshToken = snap.data()?.refresh_token
    console.log(`Old: ${oldRefreshToken}`)
    const res = await getOrRefreshUserAccessToken(environment,clientId, clientSecret, undefined, oldRefreshToken)
    console.log(res.data)
    return res
})

export const getListings = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayListingRequest): Promise<any> => {
    //get token
    const token = ''
    const res = await getListingsData(request.data.environment, token, request.data.granularityLevel, request.data.daysAgo)
})

function setSecrets() {
    if(environment === 'PRODUCTION') {
        clientId = ebayClientId.value()
        clientSecret = ebayClientSecret.value()
    } else {
        clientSecret = sandboxClientSecret.value()
        clientId = sandboxClientId.value()
    }
    return (clientId && clientSecret)
}


import { log } from 'firebase-functions/logger'
import { onRequest } from 'firebase-functions/v2/https'


import { getNextSequentialId } from '../common'
const stripeSecretKey = defineSecret("STRIPE_RESTRICTED_KEY")
const stripeWebhookSecretKey = defineSecret("STRIPE_WEBHOOK_SECRET_KEY")

export const ebayNotificationController =  onRequest(async(req, res): Promise<any> => {
    console.log(req)

    if(!req || !req.headers || !req.headers['stripe-signature']) {
        log('Request missing stripe webhook headers')
        return res.status(400).send('Request missing stripe webhook headers')
    }
    let signature = req.headers["stripe-signature"]
    let event
    // try {
    //     event = stripe.webhooks.constructEvent(
    //         req.rawBody,
    //         signature,
    //         stripeWebhookSecretKey.value()
    //     )
    // } catch (e: any) {
    //     log('Webhook signature failed')
    //     return res.status(400).send('Webhook signature failed')
    // }

    // if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    //     await fulfillCheckout(event.data.object)
    //     log(event.data.object)
    // }
    res.status(200).send()
})