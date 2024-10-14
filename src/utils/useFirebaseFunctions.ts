import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

export default function getFirebaseFunction(functionName: string) {
    const functions = getFunctions()
    if(import.meta.env.VITE_EMULATE_FIREBASE_FUNCTIONS === "true") {
        console.log('Using Firebase function emulator')
        connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    }
    try {
        return httpsCallable(functions, functionName)
    } catch (e: any) {
        return undefined
    }
}
