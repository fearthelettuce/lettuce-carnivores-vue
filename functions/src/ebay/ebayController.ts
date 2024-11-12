import admin from 'firebase-admin'
import { onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params'
import type {  EbayAccessTokenRequest, EbayEnvironment, EbayInventoryRequest, EbayInventoryPostRequest, EbayOfferPostRequest, EbaySkuRequest, EbayItemNotification } from '../types/Ebay';
import { submitAccessTokenRequest, generateUserConsentUrl, getAccessToken, updateUserAccessToken, getSkuFromEbayResponse } from './ebayService';
import { getInventoryItems, createOrReplaceInventoryItem, postEbayOffer, publishOffer } from './ebayData';
import { formatLocalDate, parseXmlResponse, unwrapResponse } from '../common';
import { info, error } from 'firebase-functions/logger'
import { onRequest } from 'firebase-functions/v2/https'
import { updateEbayInventory, updateInventoryFromEbaySale } from '../inventory/inventoryService'

const ebayClientId = defineSecret('EBAY_CLIENT_ID')
const ebayClientSecret = defineSecret('EBAY_SECRET_ID')
const onCallOpts = {secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}
const environment: EbayEnvironment = 'PRODUCTION'
let clientId: string
let clientSecret: string
let accessToken: string
export const getEbayAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}

    const res = await submitAccessTokenRequest(request.data.environment, clientId, clientSecret )
    if(res.success && res.data && 'access_token' in res.data) {
        accessToken = res.data.access_token
    } else {
        error(res.data)
        return {success: false, error: true, message: 'Unable to get Access Token', errorDetails: res.data}
    }
    return unwrapResponse(res)
})

export const getUserConsent = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: CallableRequest): Promise<any> => {
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    return generateUserConsentUrl(environment, clientId)
})

export const getUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    if(!setSecrets()) {return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    const res = await updateUserAccessToken(clientId, clientSecret, request.data.authCode)
    .catch(e => {
        console.error(e)
        return {success: false, error: true, errorDetails: e, data: null, message: 'Error getting or refreshing token'}
    })
    return unwrapResponse(res)
})

export const refreshUserAccessToken = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayAccessTokenRequest): Promise<any> => {
    if(!setSecrets()) {return {success: false, message: 'Unable to get clientId or clientSecret'}}
    const res = await getAccessToken()
    return unwrapResponse(res)
})

export const getInventory = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayInventoryRequest): Promise<any> => {
    const tokenData = await getAccessToken()
    if(!tokenData.success) {
        return {error: true, success: false, message: 'Unable to get valid token'}
    }
    const res = await getInventoryItems(request.data.environment, tokenData.data.access_token, request.data.sku)
    return unwrapResponse(res)
})

export const postInventoryItem = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayInventoryPostRequest): Promise<any> => {
    const tokenData = await getAccessToken()
    if(!tokenData.success) {
        return {success: false, message: 'Unable to get valid token'}
    }
    const res = await createOrReplaceInventoryItem(tokenData.data.access_token, request.data.sku, request.data.item, request.data.plantCategoryId)
    return unwrapResponse(res)
})

export const createEbayOffer = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID']}, async(request: EbayOfferPostRequest): Promise<any> => {
    const data = request.data.data
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
    docRef.update({offerId, listingId, updatedDateTime, updatedTimestamp, active: true})
    return {success: true}
})

export const deleteEbayInventory = onCall(onCallOpts, async(request: EbaySkuRequest): Promise<any> => {
    const res = await updateEbayInventory(request.data.sku, true)
    return {success: res}
})

export const ebayNotificationController = onRequest(async(req, res): Promise<any> => {
    const now = new Date().toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
    const formattedDate = now.replace(/\//g,'-')
    info(`Ebay notification headers ${req.headers.soapaction} ${formattedDate}`)
    try {
        const parsedRequest = parseXmlResponse(req.body) as EbayItemNotification
        const sku = getSkuFromEbayResponse(parsedRequest)
        const eventType = parsedRequest.Body.GetItemResponse.NotificationEventName
        await admin.firestore().collection('ebayRequests').doc(`${formattedDate} - ${eventType}`).set(parsedRequest.Body)
        if(sku && eventType === 'ItemSold') {
            info(`Updating inventory for SKU ${sku} for eBay sale`)
            await updateInventoryFromEbaySale(sku.toString(), false)
        }
    } catch(e) {
        error(`Error handling notification`)
        error(e)
        admin.firestore().collection('ebayRequests').doc(formattedDate).set({data: e})
    }
    res.sendStatus(200)
    return
})

function setSecrets() {
    return (ebayClientId.value() && ebayClientSecret.value())
}
