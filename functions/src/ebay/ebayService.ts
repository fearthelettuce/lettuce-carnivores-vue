import admin from 'firebase-admin'
import axios from 'axios'
import type {  FunctionResponse } from '../types/Functions'
import type { EbayEnvironment, EbayAccessTokenFunctionResponse, EbayAccessTokenResponse, UserAccessTokenResponse } from '../types/Ebay'
import { Timestamp } from 'firebase-admin/firestore'

import { authUrl, sandboxAuthUrl, apiUrl, sandboxApiUrl, RuNameProd, RuNameSandbox, prodScopes, sandboxScopes} from './ebayConstants'

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
    const scopes = encodeURIComponent( environment === 'PRODUCTION' ? prodScopes : sandboxScopes)
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
    const newTokenData = {...res.data, updatedTimestamp: new Date()}
    const tokenDoc = environment === 'PRODUCTION' ? 'ebayToken' : 'sandboxToken'
    await admin.firestore().collection('admin').doc(tokenDoc).update(newTokenData)
    return {success: true, error: false, message: 'Success', data: newTokenData as unknown as UserAccessTokenResponse, errorDetails: null}
}


export async function getTokenFromDb(environment: EbayEnvironment) {
    const tokenDoc = environment === 'PRODUCTION' ? 'ebayToken' : 'sandboxToken'
    const now = new Date()
    const tokenResponse = await admin.firestore().collection('admin').doc(tokenDoc).get().catch((e) => {console.log(e); return undefined})

    if( !tokenResponse || !tokenResponse.data || !tokenResponse.data()) {
        return undefined
    }
    const tokenIssuedTime = new Date(tokenResponse.data()?.updatedTimestamp)
    const isTokenStillValid = (now.getTime() + (30*60000)) > tokenIssuedTime.getTime()
    if(isTokenStillValid) {
        return tokenResponse.data()?.access_token
    } else {
        return undefined
    }

}
