import useFirebaseFunctions from '@/utils/useFirebaseFunctions'
const environment = import.meta.env.DEV ? 'SANDBOX' : 'PRODUCTION'

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
    const res = refreshUserAccessToken(environment)
}

export async function getEbayListings() {
    const getListings = useFirebaseFunctions('getListings')
    if(!getListings) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: 'PRODUCTION', //environment,
        granularityLevel: 'Medium',
        daysAgo: 120
    }
    debugger
    const res = await getListings(data)
    console.log(res)
    return res
}
