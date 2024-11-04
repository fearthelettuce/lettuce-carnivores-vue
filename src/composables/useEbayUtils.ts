import type { EbayEnvironment, AccessTokenDBResponse } from '@/types/Ebay'
import { executeFunction, unwrapResponse} from '@/utils/useFirebaseFunctions'
import type { AppReturn, AppData, AppError, AppResponse } from '@/types/App'
import type { InventoryItem } from '@/types/ebayApi/types'
import type { HttpsCallableResult } from 'firebase/functions'
import { createEbayInventoryItem } from './buildEbayInventoryItem'
import type { Plant, PlantCategory } from '@/types/Plant'
import { buildEbayOffer } from './buildEbayOffer'
let environment: EbayEnvironment = 'PRODUCTION'
if((environment === 'PRODUCTION') || import.meta.env.PROD) {
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
    const data = {environment: environment}
    return await executeFunction<any>('getEbayAccessToken', data)
}

export async function getUserConsent() {
    const data = {environment: environment}
    const res = await executeFunction<AppData<string>>('getUserConsent', data)
    if(res.success) {
        return {success: true, data: unwrapResponse(res)}
    }
    return res
}

export async function handleEbayLogin(authCode: string, expires: string | null) {
    const data = {
        environment: environment,
        authCode: authCode,
        authCodeExpires: expires
    }
    const res = await executeFunction<any>('getUserAccessToken', data)
    return unwrapResponse(res)

}

export async function refreshAccessToken(environment: EbayEnvironment): Promise<AppData<AccessTokenDBResponse> | AppError> {
    const res = await executeFunction<{data: AccessTokenDBResponse}>('refreshUserAccessToken', {environment: environment})
    console.log(res)
    const data = unwrapResponse(res)
    if(res.success && 'access_token' in data) {
        return {success: true, data}
    }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function getInventoryItem(sku: string): Promise<AppData<HttpsCallableResult<InventoryItem>> | AppError> {
    const res = await executeFunction<InventoryItem>('getInventory', {environment: environment, sku: sku})
    if(res.success) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function addOrReplaceEbayInventory(plantCategory: PlantCategory, plant: Plant) {
    const item = await createEbayInventoryItem(plantCategory, plant)
    if(!item || !item.success) {
        return {success: false, message: 'Unable to create item'}
    }
        const res = unwrapResponse(await postInventoryItem(plant.sku, item.data))
        return res
}

export async function postInventoryItem(sku: string, item: InventoryItem): Promise<AppReturn | AppError> {
    const res = await executeFunction<InventoryItem>('postInventoryItem', {environment: environment, sku: sku, item: item})
    if(res && res.success) {
        return {success: true}
    }
    if(isSuccess(res)) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function postOffer(plantCategory: PlantCategory, plant: Plant): Promise<AppReturn | AppError> {
    const offer = await buildEbayOffer(plantCategory, plant)
    if(!offer) {
        return {success: false, errorMessage: 'Unable to create offer'}
    }
    const res = await executeFunction<AppReturn>('createEbayOffer', {environment: environment, data: offer})
    if(res && res.success) {
        return {success: true}
    }
    if(isSuccess(res)) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}



export function isEbayTokenExpired(data: AccessTokenDBResponse) {
    const now = Math.floor(Date.now() / 1000)
    const tokenExpiration = data.updatedTimestamp + (110*60) //tokens are valid for 120 min, refresh after 110
    return now > tokenExpiration
}


export async function deleteEbayItem(sku: string , token: string) {
    const res = await executeFunction('deleteEbayInventory', {environment: environment, sku: sku, token: token})
    if(res && res.success) {
        return {success: true}
    }
    if(isSuccess(res)) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

// export async function deleteEbayItem(sku: string): AppReturn | AppError<any> {
//     let deleteInventory
//     try {
//         deleteInventory = useFirebaseFunctions('deleteInventory')
//     } catch {
//         console.error('Unable to get FB function')
//         return {success: false, errorMessage: 'Unable to get FB Function'}
//     }
//     if(deleteInventory === undefined) { return {success: false, errorMessage: 'Unable to get FB Function'} }

//     try {
//         const res = await deleteInventory({ environment: environment,sku: sku })
//         return {success: true}
//     } catch (e: any) {
//         return {success: false, errorMessage: 'Error calling function', errorDetails: e}
//     }

// }

export function isSuccess<T, E>(res: AppResponse<T> | AppError): res is AppResponse<T> {
    return res.success === true
}
