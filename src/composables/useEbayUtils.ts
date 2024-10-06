import useFirebaseFunctions from '@/utils/useFirebaseFunctions'

export async function testEbay() {
    const getTestEbay = useFirebaseFunctions('getTestEbay')
    if(!getTestEbay) {
        return undefined
    }
    const environment = 'SANDBOX'
    const testEbayData = {environment: environment, name: 'Beans', id: 123}
    const res = await getTestEbay(testEbayData).catch((e: any) => {
        console.error(e)
        return {success: false, error: true, message: e.message, errorDetails: e}
    })
    console.log(res)
    return res
}