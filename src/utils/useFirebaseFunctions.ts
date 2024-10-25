import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import type { AppReturn, AppData, AppError, AppResponse } from '@/types/App'
import type { HttpsCallableResult } from 'firebase/functions'

export function getFirebaseFunction(functionName: string) {
    const functions = getFunctions()
    if(import.meta.env.VITE_EMULATE_FIREBASE_FUNCTIONS === "true") {
        console.log('Using Firebase function emulator')
        connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    }
    try {
        return {success: true, res: httpsCallable(functions, functionName)}
    } catch (e: any) {
        if(import.meta.env.MODE !== 'PRODUCTION' && import.meta.env.VITE_EMULATE_FIREBASE_FUNCTIONS === "true") {
            return {success: false, errorMessage: 'Unable to get FIrebase functions, may need to start emulator'}
        }
        return {success: false, errorMessage: 'Unable to get Firebase functions'}
    }
}

export async function executeFunction<T>(functionName: string, params: any): Promise<AppResponse<HttpsCallableResult<T>> | AppError> {
    let firebaseFunction
    try {
        const res = getFirebaseFunction(functionName)
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

export function unwrapResponse(res: any) {
    if('res' in res) {
        if('data' in res.res) {
            return res.res.data
        }
        if('res' in res.res) {
            return res.res.res
        }
        return res.res
    }
    if('data' in res) {
        if('data' in res.data) {
            return res.data.data
        }
        return res.data
    }
    return res
}
