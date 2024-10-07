import admin from 'firebase-admin'
import axios from 'axios'
import type {  FunctionResponse } from '../types/Functions'
import type { EbayEnvironment, EbayAccessTokenFunctionResponse, EbayAccessTokenResponse, UserAccessTokenResponse } from '../types/Ebay'

const authUrl = 'https://auth.ebay.com'
const sandboxAuthUrl = 'https://auth.sandbox.ebay.com'
const apiUrl = 'https://api.ebay.com'
const sandboxApiUrl = 'https://api.sandbox.ebay.com'
const RuNameProd = 'Brad_Schickler-BradSchi-Danger-rlrsokpah'
const RuNameSandbox = 'Brad_Schickler-BradSchi-Danger-mwcclbvw'
const scopes = 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.marketplace.insights.readonly https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly https://api.ebay.com/oauth/api_scope/buy.shopping.cart https://api.ebay.com/oauth/api_scope/buy.offer.auction https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.email.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.phone.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.address.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.name.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.status.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/sell.item.draft https://api.ebay.com/oauth/api_scope/sell.item https://api.ebay.com/oauth/api_scope/sell.reputation https://api.ebay.com/oauth/api_scope/sell.reputation.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly https://api.ebay.com/oauth/api_scope/sell.stores https://api.ebay.com/oauth/api_scope/sell.stores.readonly'

export async function submitAccessTokenRequest(environment: EbayEnvironment, clientId: string, clientSecret: string): Promise<EbayAccessTokenFunctionResponse | FunctionResponse> {
    const url = `${environment === 'PRODUCTION' ? authUrl : sandboxAuthUrl}/identity/v1/oauth2/token`
    //const encodedScopes = encodeURIComponent(scopes)
    if(!clientId || !clientSecret) { return {success: false, error: true, message: 'Unable to get access token', errorDetails: null, data: null}}
    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64') 
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
    }
    const body = {
        'grant_type': 'client_credentials',
        
    }
    const res = await axios.post(url,body,{headers: headers})
    .catch((e) => {
        console.log(e.response.data)
        return {success: false, error: true, message: 'Unable to get access token', errorDetails: e.response.data, data: null}
    })
    return {success: true, error: false, message: 'Success', data: res.data as unknown as EbayAccessTokenResponse, errorDetails: null}
}

export function generateUserConsentUrl(environment: EbayEnvironment, clientId: string, state?: string){
    const url = `${environment === 'PRODUCTION' ? authUrl : sandboxAuthUrl}/oauth2/authorize`
    const RuName = environment === 'PRODUCTION' ? RuNameProd : RuNameSandbox
    const scopes = encodeURIComponent('https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.marketplace.insights.readonly https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly https://api.ebay.com/oauth/api_scope/buy.shopping.cart https://api.ebay.com/oauth/api_scope/buy.offer.auction https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.email.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.phone.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.address.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.name.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.status.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/sell.item.draft https://api.ebay.com/oauth/api_scope/sell.item https://api.ebay.com/oauth/api_scope/sell.reputation https://api.ebay.com/oauth/api_scope/sell.reputation.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly https://api.ebay.com/oauth/api_scope/sell.stores https://api.ebay.com/oauth/api_scope/sell.stores.readonly')
    const userConsentParams: {[key: string]: string} = {
            client_id: clientId,
            redirect_uri: RuName,
            response_type: 'code',
            scope: scopes,
    }
    if(state) {
        userConsentParams['state'] = state
    }
    if(!clientId) { return undefined}
    const params = new URLSearchParams(userConsentParams)
    const ebayLoginUrl = `${url}?${params}`
    return ebayLoginUrl
}

export async function getOrRefreshUserAccessToken(
    environment: EbayEnvironment, 
    clientId: string, 
    clientSecret: string, 
    authCode: string | undefined,
    refreshToken?: string | undefined
): Promise<UserAccessTokenResponse | FunctionResponse> {
    const url = `${environment === 'PRODUCTION' ? apiUrl : sandboxApiUrl}/identity/v1/oauth2/token`
    const RuName = environment === 'PRODUCTION' ? RuNameProd : RuNameSandbox
    if(!clientId || !clientSecret) { return {success: false, error: true, message: 'Unable to get access token', errorDetails: null, data: null}}
    if(!authCode && !refreshToken) { return {success: false, error: true, message: 'Missing auth code or refresh token', errorDetails: null, data: null}}
    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64') 
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
    }
    let body
    if(authCode !== undefined) {
        body = {
            'grant_type': 'authorization_code',
            'redirect_uri': RuName,
            code: decodeURI(authCode)       
        }
    } else if (refreshToken !== undefined) {
        body = {
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
        }
    }
    const res = await axios.post(url,body,{headers: headers}).catch((e) => {
        console.log(e)
        return {success: false, error: true, message: 'Unable to get access token', errorDetails: e, data: null}
    })
    console.log(res.data)
    if(!res || !res.data) {
        console.log('hi')
        let messageText = ''
        if('message' in res) {
            messageText = res.message
        }
        let errorDetails = {}
        if('errorDetails' in res) {
            errorDetails = res.errorDetails
        }
        return {success: false, error: true, message: messageText, errorDetails: errorDetails, data: null}
    }
    const tokenDoc = environment === 'PRODUCTION' ? 'ebayToken' : 'sandboxToken'
    await admin.firestore().collection('admin').doc(tokenDoc).update(res.data)
    return {success: true, error: false, message: 'Success', data: res.data as unknown as UserAccessTokenResponse, errorDetails: null}

}