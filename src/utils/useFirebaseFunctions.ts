import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

export default function getFirebaseFunction(functionName: string) {
    const useEmulator = true
    const functions = getFunctions()
    if(useEmulator) {
        connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    }
    try {
        return httpsCallable(functions, functionName)
    } catch (e: any) {
        return undefined
    }
}