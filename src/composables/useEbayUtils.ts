import type { EbayEnvironment, AccessTokenDBResponse } from '@/types/Ebay'
import useFirebaseFunctions from '@/utils/useFirebaseFunctions'
import type { AppReturn, AppData, AppError, AppResponse } from '@/types/App'
import type { InventoryItem } from '@/types/ebayApi/types'
import type { HttpsCallableResult } from 'firebase/functions'
import { createEbayInventoryItem } from './buildEbayInventoryItem'
import type { Plant, PlantCategory } from '@/types/Plant'

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
    const data = {environment: environment}
    return await executeFunction<any>('getEbayAccessToken', data)
}

export async function getUserConsent() {
    const data = {environment: environment}
    const res = await executeFunction<string>('getUserConsent', data)
    if(isSuccess(res)) {
        return res.res.data
    }
}

export async function handleEbayLogin(authCode: string, expires: string | null) {
    const data = {
        environment: environment,
        authCode: authCode,
        authCodeExpires: expires
    }
    return await executeFunction<any>('getUserAccessToken', data)
}

export async function refreshAccessToken(): Promise<AppData<AccessTokenDBResponse> | AppError> {
    const res = await executeFunction<{data: AccessTokenDBResponse}>('refreshUserAccessToken', {environment: environment})
    if(isSuccess(res)) {
        console.log(res.res.data?.data)
        return {success: true, data: res.res.data?.data}
    }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function getInventoryItem(sku: string): Promise<AppResponse<HttpsCallableResult<InventoryItem>> | AppError> {
    const res = await executeFunction<InventoryItem>('getInventory', {environment: environment, sku: sku})
    if(isSuccess(res)) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function postInventoryItem(sku: string, item: InventoryItem): Promise<AppResponse<HttpsCallableResult<InventoryItem>> | AppError> {
    const res = await executeFunction<InventoryItem>('postInventoryItem', {environment: environment, sku: sku, item: item})
    if(isSuccess(res)) { return res }
    return {success: false, errorMessage: res.message ?? '', errorDetails: res}
}

export async function addOrReplaceEbayInventory(plantCategory: PlantCategory, plant: Plant) {
    const item = await createEbayInventoryItem(plantCategory, plant)
    if(!item || !item.success) {
        return {success: false, message: 'Unable to create item'}
    }
        const res = await postInventoryItem(plant.sku, item.data)
        if(res.success && res.res && res.res.data) {
            return res.res.data
        }
        return res
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

export async function executeFunction<T>(functionName: string, params: any): Promise<AppResponse<HttpsCallableResult<T>> | AppError> {
    let firebaseFunction
    try {
        const res = useFirebaseFunctions(functionName)
        firebaseFunction = res.res
    } catch (e: any) {
        console.error('Unable to get FB function')
        return {success: false, errorMessage: `Unable to get FB Function ${functionName}`, errorDetails: e}
    }
    if(firebaseFunction === undefined) { return {success: false, errorMessage: `Unable to get FB Function ${functionName}`} }
    try {
        const res = await firebaseFunction(params) as HttpsCallableResult<T>
        console.log(res)
        return {success: true, res: res}
    } catch (e: any) {
        console.error(e)
        return {success: false, errorMessage: `Error calling FB Function ${functionName}`, errorDetails: e}
    }
}

export function isSuccess<T, E>(res: AppResponse<T> | AppError): res is AppResponse<T> {
    return res.success === true
}
