import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

export default function getFirebaseFunction(functionName: string) {
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
