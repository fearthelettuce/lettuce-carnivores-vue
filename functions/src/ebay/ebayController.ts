import { onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params'

import type { FunctionResponse } from '../types/Functions';
import axios from 'axios'

const ebayClientId = defineSecret('EBAY_CLIENT_ID')
const ebayClientSecret = defineSecret('EBAY_SECRET_ID')
const sandboxClientId = defineSecret('EBAY_SANDBOX_CLIENT_ID')
const sandboxClientSecret = defineSecret('EBAY_SANDBOX_CLIENT_SECRET')


interface TestEbayRequest extends CallableRequest  {
    data: {
        environment: 'SANDBOX' | 'PRODUCTION',
        name: string,
        id: number

    }
}

export const getTestEbay = onCall({secrets: ['EBAY_CLIENT_ID', 'EBAY_SECRET_ID', 'EBAY_SANDBOX_CLIENT_ID', 'EBAY_SANDBOX_CLIENT_SECRET']}, async(request: TestEbayRequest): Promise<any> => {
    //console.log(request.data)
    let clientId
    let clientSecret
    if(request.data.environment === 'PRODUCTION') {
        clientId = ebayClientId.value()
        clientSecret = ebayClientSecret.value()
    } else {
        clientSecret = sandboxClientSecret.value()
        clientId = sandboxClientId.value()
    }
    if(!clientId || !clientSecret) { return {success: false, error: true, message: 'Unable to get clientId or clientSecret', errorDetails: {}, data: {}}}
    const res = await getEbayAuthToken(request.data.environment, clientId, clientSecret )
    // if(res && res.success) {
    //     return res.data
    // }
    // if(res && res.data.access_token){
    //     return {success: true, error: false, message: 'Success', errorDetails: null, data: {token: res.data.access_token}}
    // } else {
    //     return {success: false, error: true, message: null, errorDetails: null, data: res}
    // }
    console.log(res)
    return res
})

// async function getEbayAuthTokenLib(environment: "SANDBOX" | "PRODUCTION" = 'PRODUCTION') {
//     let clientId
//     let clientSecret
//     if(environment === 'PRODUCTION') {
//         clientId = ebayClientId
//         clientSecret = ebayClientSecret
//     } else {
//         clientSecret = sandboxClientSecret
//         clientId = sandboxClientId
//     }
//     console.log(`client ID: ${clientId.value()}`)
//     console.log(`client secret: ${clientSecret.value()}`)
//     const ebayAuthToken = new EbayAuthToken({
//         clientId: clientId.value(),
//         clientSecret: clientSecret.value(),
//         redirectUri: 'https://dangerlettuce.com/plantAdmin'
//     })

//     const clientScope = 'https://api.ebay.com/oauth/api_scope';
//     // // Client Crendential Auth Flow
//     ebayAuthToken.getApplicationToken(environment, clientScope).then((data) => {
//         console.log(data);
//     }).catch((error) => {
//         console.log(`Error to get Access token :${JSON.stringify(error)}`);
//     });

//     // try{
//     //     const token = await ebayAuthToken.getApplicationToken(environment)
//     //     console.log(token)
//     //     return ebayAuthToken
//     // } catch (e: any) {
//     //     console.log(e)
//     //     return
//     // }    
// }

type EbayAccessTokenResponse = {access_token: string, expires_in: number, token_type: string}

async function getEbayAuthToken(environment: 'SANDBOX' | 'PRODUCTION', clientId: string, clientSecret: string): Promise<FunctionResponse> {
    const url = environment === 'PRODUCTION' ? 'https://api.ebay.com/identity/v1/oauth2/token' : 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
    const scopes = encodeURIComponent('https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.marketplace.insights.readonly https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly https://api.ebay.com/oauth/api_scope/buy.shopping.cart https://api.ebay.com/oauth/api_scope/buy.offer.auction https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.email.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.phone.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.address.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.name.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.status.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/sell.item.draft https://api.ebay.com/oauth/api_scope/sell.item https://api.ebay.com/oauth/api_scope/sell.reputation https://api.ebay.com/oauth/api_scope/sell.reputation.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly https://api.ebay.com/oauth/api_scope/sell.stores https://api.ebay.com/oauth/api_scope/sell.stores.readonly')
    if(!clientId || !clientSecret) { return {success: false, error: true, message: 'Unable to get access token', errorDetails: null, data: {}}}
    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64') 
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
    }
    const body = {
        'grant_type': 'client_credentials',
        
    }
    // console.log(headers)
    // console.log(body)
    const res = axios.post(url,body,{headers: headers})
    .then(res => {
        return {success: true, error: false, message: 'Success', data: res.data, errorDetails: null}
    })
    .catch((e) => {
        console.log(e.response.data)
        return {success: false, error: true, message: 'Unable to get access token', errorDetails: e.response.data, data: {}}
    })
    return res
}