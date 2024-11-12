import type { EbayEnvironment } from '@/types/Ebay'
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

export async function addOrReplaceEbayInventory(plantCategory: PlantCategory, plant: Plant) {
    const item = await createEbayInventoryItem(plantCategory, plant)
    if(!item || !item.success) {
        return {success: false, message: 'Unable to create item'}
    }
        const res = unwrapResponse(await postInventoryItem(plant.sku, item.data, plantCategory.id))
        return res
}

export async function postInventoryItem(sku: string, item: InventoryItem, plantCategoryId: string): Promise<AppReturn | AppError> {
    const res = await executeFunction<InventoryItem>('postInventoryItem', {sku, item, plantCategoryId})
    if(res && res.success) {
        return {success: true}
    }
    if(isSuccess(res)) { return res }
    return {success: false, message: res.message ?? '', errorDetails: res}
}

export async function postOffer(plantCategory: PlantCategory, plant: Plant): Promise<AppReturn | AppError> {
    const offer = await buildEbayOffer(plantCategory, plant)
    if(!offer) {
        return {success: false, message: 'Unable to create offer'}
    }
    const res = await executeFunction<AppReturn>('createEbayOffer', {environment, data: offer})
    if(res && res.success) {
        return {success: true}
    }
    if(isSuccess(res)) { return res }
    return {success: false, message: res.message ?? '', errorDetails: res}
}


export async function deleteEbayItem(sku: string) {
    const res = await executeFunction('deleteEbayInventory', {sku})
    return unwrapResponse(res)
}

export function isSuccess<T, E>(res: AppResponse<T> | AppError): res is AppResponse<T> {
    return res.success === true
}
