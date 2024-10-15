import type { EbayEnvironment } from '@/types/Ebay'
import useFirebaseFunctions from '@/utils/useFirebaseFunctions'
let environment: EbayEnvironment
if((import.meta.env.VITE_EBAY_ENVIRONMENT && import.meta.env.VITE_EBAY_ENVIRONMENT === 'PRODUCTION') || import.meta.env.PROD) {
    environment = 'PRODUCTION'
} else {
    environment = 'SANDBOX'
}

type FunctionResponse = {
    success: boolean,
    error: boolean,
    data?: Object | null,
    errorDetails?: Object | null,
    message: string,
}

export async function getEbayAccessToken() {
    const getEbayAccessToken = useFirebaseFunctions('getEbayAccessToken')
    if(!getEbayAccessToken) {
        return undefined
    }
    const data = {environment: environment}
    const res = await getEbayAccessToken(data).catch((e: any) => {
        console.error(e)
        return {success: false, error: true, message: e.message, errorDetails: e}
    })
    console.log(res)
    return res
}

export async function getUserConsent() {

    const getUserConsent = useFirebaseFunctions('getUserConsent')
    if(!getUserConsent) {
        return undefined
    }
    const data = {environment: environment}
    const res = await getUserConsent(data).catch(e => {console.error(e); return undefined})
    console.log(res)
    return res
}

export async function handleEbayLogin(authCode: string, expires: string | null) {
    const getUserAccessToken = useFirebaseFunctions('getUserAccessToken')
    if(!getUserAccessToken) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: environment,
        authCode: authCode,
        authCodeExpires: expires
    }
    const res = await getUserAccessToken(data).catch(e => {console.error(e); return false})
    console.log(res)
    if((res as {data: FunctionResponse}).data.success) {
        return true
    } else {
        console.log(res)
        return false
    }
}

export async function refreshAccessToken() {
    const refreshUserAccessToken = useFirebaseFunctions('refreshUserAccessToken')
    if(!refreshUserAccessToken) {
        console.error('Unable to get FB function')
        return undefined
    }
    const res = refreshUserAccessToken({environment: environment})
    return res
}

export async function getEbayListings() {
    const getListings = useFirebaseFunctions('getListings')
    if(!getListings) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: environment,
        granularityLevel: 'Medium',
        daysAgo: 120
    }
    const res = await getListings(data)
    const jsonRes = JSON.parse(res.data)
     setEbayListingData(jsonRes)
    return jsonRes
}

type EbayListing = {
    [key: string]: string
}
function setEbayListingData(data) {
    const items = data.ItemArray[0].Item
    console.log(items)
}
