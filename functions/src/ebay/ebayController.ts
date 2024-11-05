import admin from 'firebase-admin'
import { onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params'
import type {  EbayAccessTokenRequest, EbayEnvironment, EbayInventoryRequest, EbayInventoryPostRequest, EbayOfferPostRequest, EbaySkuRequest } from '../types/Ebay';
import { submitAccessTokenRequest, generateUserConsentUrl, getAccessToken, updateUserAccessToken } from './ebayService';
import { getInventoryItems, deleteEbayInventoryItem, createOrReplaceInventoryItem, postEbayOffer, publishOffer } from './ebayData';
import { unwrapResponse } from '../common';

const ebayClientId = defineSecret('EBAY_CLIENT_ID')
const ebayClientSecret = defineSecret('EBAY_SECRET_ID')
const sandboxClientId = defineSecret('EBAY_SANDBOX_CLIENT_ID')
const sandboxClientSecret = defineSecret('EBAY_SANDBOX_CLIENT_SECRET')
const onCallOpts = {secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}
let environment: EbayEnvironment
let clientId: string
let clientSecret: string
let accessToken: string
export const getEbayAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}

    const res = await submitAccessTokenRequest(request.data.environment, clientId, clientSecret )
    if(res.success && res.data && 'access_token' in res.data) {
        accessToken = res.data.access_token
    } else {
        console.log(res.data)
        return {success: false, error: true, message: 'Unable to get Access Token', errorDetails: res.data}
    }
    return unwrapResponse(res)
})

export const getUserConsent = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: CallableRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    return generateUserConsentUrl(environment, clientId)
})

export const getUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    environment = request.data.environment
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    const res = await updateUserAccessToken(clientId, clientSecret, request.data.authCode)
    .catch(e => {
        console.error(e)
        return {success: false, error: true, errorDetails: e, data: null, message: 'Error getting or refreshing token'}
    })
    return unwrapResponse(res)
})

export const refreshUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    if(!setSecrets()) {return {success: false, message: 'Unable to get clientId or clientSecret'}}
    const res = await getAccessToken()
    return unwrapResponse(res)
})

export const getInventory = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayInventoryRequest): Promise<any> => {
    const tokenData = await getAccessToken()
    if(!tokenData.success) {
        return {error: true, success: false, message: 'Unable to get valid token'}
    }
    const res = await getInventoryItems(request.data.environment, tokenData.data.access_token, request.data.sku)
    return unwrapResponse(res)
})

export const postInventoryItem = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayInventoryPostRequest): Promise<any> => {
    const tokenData = await getAccessToken()
    if(!tokenData.success) {
        return {success: false, message: 'Unable to get valid token'}
    }
    const res = await createOrReplaceInventoryItem(tokenData.data.access_token, request.data.sku, request.data.item, request.data.plantCategoryId)
    if('success' in res) {
        return res.success
    }
    if('res' in res) {
        return res.res
    }
    if('data' in res) {
        return res.data
    }
    return res
})

export const createEbayOffer = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: EbayOfferPostRequest): Promise<any> => {
    const data = request.data.data
    const environment = request.data.environment
    const tokenData = await getAccessToken()
    if(!tokenData.success) {
        return {error: true, success: false, message: 'Unable to get valid token'}
    }
    const docRef = admin.firestore().collection('inventory').doc(data.sku)
    const snap = (await docRef.get()).data()
    let res
    if(snap && 'offerId' in snap) {
        res = await postEbayOffer(tokenData.data.access_token, data, environment, snap.offerId)
    } else {
        res = await postEbayOffer(tokenData.data.access_token, data, environment)
    }


    if(!res || !('success' in res) || !res.success) {
        return { success: false, message: 'Error posting offer'}
    }
    const offerId = res.data.offerId
    const publishRes = await publishOffer(tokenData.data.access_token, offerId, environment)
    if(!publishRes || !('success' in publishRes) || !publishRes.success) {
        return { success: false, message: 'Error publishing offer'}
    }
    const listingId = publishRes.data.listingId
    const updatedDateTime = new Date().toLocaleString("en-US", {timeZone: 'America/Chicago'})
    const updatedTimestamp = Math.floor(Date.now() / 1000)
    docRef.update({offerId, listingId, updatedDateTime, updatedTimestamp})
    return {success: true}

})


export const deleteEbayInventory = onCall(onCallOpts, async(request: EbaySkuRequest): Promise<any> => {
    const tokenData = await getAccessToken()
    const sku = request.data.sku
    if(!tokenData.success) {
        return {success: false, message: 'Unable to get valid token'}
    }
    if(!request.data.sku || request.data.sku.length < 1) {
        return {success: false, message: 'Invalid SKU'}
    }
    const res = await deleteEbayInventoryItem(sku, tokenData.data.access_token)
    admin.firestore().collection('inventory').doc(sku).delete()
    return res
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
