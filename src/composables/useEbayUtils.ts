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
    try{
        const res = refreshUserAccessToken({environment: environment})
        return res
    } catch (e: any) {
        console.log('hi')
        return {success: false, error: true, errorDetails: e.message}
    }
}

export async function getEbayListings() {
    let getListings
    try {
        getListings = useFirebaseFunctions('getListings')
    } catch {
        console.error('Unable to get FB function')
        return undefined
    }

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
    const jsonRes = JSON.parse(res.data as string)
     setEbayListingData(jsonRes)
    return jsonRes
}

type EbayListing = {
    [key: string]: string
}
function setEbayListingData(data: any) {
    const items = data.ItemArray[0].Item
    console.log(items)
}

export async function getInventoryItem(sku: string) {

}

export async function deleteEbayItem(sku: string) {
    let deleteInventory
    try {
        deleteInventory = useFirebaseFunctions('deleteInventory')
    } catch {
        console.error('Unable to get FB function')
        return undefined
    }

    if(!deleteInventory) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: environment,
        sku: sku,
    }
    const res = await deleteInventory(data)
    return res
}

//BulkMigrateListingResponse
// {
//   "responses": [
//     {
//       "statusCode": 200,
//       "listingId": "135248481479",
//       "marketplaceId": "EBAY_US",
//       "inventoryItems": [
//         {
//           "sku": "Specimen 1432",
//           "offerId": "543632798016"
//         }
//       ]
//     }
//   ]
// }
