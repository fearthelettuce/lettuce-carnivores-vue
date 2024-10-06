
export async function getEbayAuthToken(environment: "SANDBOX" | "PRODUCTION" = 'PRODUCTION') {
    let ebayClientId
    let ebayClientSecret
    // if(environment === 'PRODUCTION') {
    //     ebayClientId = defineSecret('EBAY_CLIENT_ID')
    //     ebayClientSecret = defineSecret('EBAY_SECRET_ID')
    // } else {
    //     ebayClientId = defineSecret('EBAY_SANDBOX_CLIENT_ID')
    //     ebayClientSecret = defineSecret('EBAY_SANDBOX_CLIENT_SECRET')
    // }
    // console.log(`client ID: ${ebayClientId.toString()}`)
    // const ebayAuthToken = new EbayAuthToken({
    //     clientId: ebayClientId.toString(),
    //     clientSecret: ebayClientSecret,
    //     redirectUri: 'https://dangerlettuce.com/plantAdmin'
    // })

    // try{
    //     const token = await ebayAuthToken.getApplicationToken(environment)
    //     console.log(token)
    //     return ebayAuthToken
    // } catch (e: any) {
    //     throw new Error(`Unable to get token ${e.toString()}`)
    // }    
}