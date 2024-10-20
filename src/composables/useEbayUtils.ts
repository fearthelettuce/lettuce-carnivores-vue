import type { EbayEnvironment } from '@/types/Ebay'
import useFirebaseFunctions from '@/utils/useFirebaseFunctions'
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
    try{
        const res = refreshUserAccessToken({environment: environment})
        return res
    } catch (e: any) {
        console.log('hi')
        return {success: false, error: true, errorDetails: e.message}
    }
}

export async function getEbayListings() {
    let getListings
    try {
        getListings = useFirebaseFunctions('getListings')
    } catch {
        console.error('Unable to get FB function')
        return undefined
    }

    if(!getListings) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: environment,
        granularityLevel: 'Medium',
        daysAgo: 120
    }
    const res = await getListings(data)
    const jsonRes = JSON.parse(res.data as string)
     setEbayListingData(jsonRes)
    return jsonRes
}

type EbayListing = {
    [key: string]: string
}
function setEbayListingData(data: any) {
    const items = data.ItemArray[0].Item
    console.log(items)
}

export async function getInventoryItem(sku: string) {

}

export async function deleteEbayItem(sku: string) {
    let deleteInventory
    try {
        deleteInventory = useFirebaseFunctions('deleteInventory')
    } catch {
        console.error('Unable to get FB function')
        return undefined
    }

    if(!deleteInventory) {
        console.error('Unable to get FB function')
        return undefined
    }
    const data = {
        environment: environment,
        sku: sku,
    }
    const res = await deleteInventory(data)
    return res
}

//BulkMigrateListingResponse
// {
//   "responses": [
//     {
//       "statusCode": 200,
//       "listingId": "135248481479",
//       "marketplaceId": "EBAY_US",
//       "inventoryItems": [
//         {
//           "sku": "Specimen 1432",
//           "offerId": "543632798016"
//         }
//       ]
//     }
//   ]
// }


//GetInventoryItems

// {
//   "total": 1,
//   "size": 1,
//   "href": "/sell/inventory/v1/inventory_item?offset=0&limit=2",
//   "limit": 2,
//   "inventoryItems": [
//     {
//       "sku": "Specimen 1432",
//       "locale": "en_US",
//       "product": {
//         "title": "Heliamphora nutans 'Giant' / H. glabra x nutans - 4\" deep pot",
//         "aspects": {
//           "Climate": [
//             "Highland"
//           ],
//           "Common Name": [
//             "Pitcher Plant"
//           ],
//           "Indoor/Outdoor": [
//             "Indoor"
//           ],
//           "Growth Habit": [
//             "Clumping"
//           ],
//           "California Prop 65 Warning": [
//             "I don't have cancer yet, if that tells you anything"
//           ],
//           "Brand": [
//             "Unbranded"
//           ],
//           "Plant Form": [
//             "Rooted"
//           ],
//           "Type": [
//             "Carnivorous Plants"
//           ],
//           "Growth Stage": [
//             "Mature"
//           ],
//           "Watering": [
//             "Heavy"
//           ],
//           "Genus": [
//             "Heliamphora"
//           ],
//           "Number in Pack": [
//             "1"
//           ],
//           "Sunlight": [
//             "Full Sun"
//           ],
//           "Features": [
//             "Potted"
//           ]
//         },
//         "imageUrls": [
//           "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/gMQAAOSwirhm5eza/$_57.JPG?set_id=880000500F",
//           "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/~H4AAOSwNqBm5eza/$_57.JPG?set_id=880000500F",
//           "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/xrMAAOSwhbFm5eza/$_57.JPG?set_id=880000500F"
//         ]
//       },
//       "packageWeightAndSize": {
//         "dimensions": {
//           "width": 6,
//           "length": 12,
//           "height": 6,
//           "unit": "INCH"
//         },
//         "weight": {
//           "value": 1.75,
//           "unit": "POUND"
//         }
//       },
//       "availability": {
//         "shipToLocationAvailability": {
//           "quantity": 1
//         }
//       }
//     }
//   ]
// }


// getInventoryItem where space is escaped as %20
//https://api.ebay.com/sell/inventory/v1/inventory_item/Specimen%201432
//headers

// rlogid:t6pitnmsgwj70%3D9whhpitnmsgwj70*43%3Fly%28rbpv6713-192a8ca18f6-0x2b1b
// content-language:en-GB
// x-ebay-request-id:192a8ca1-8fa0-a0f1-31c7-ed9ffe450a9f!inventory_item_GET!rnoslrinvapi26-769kz-tess0026.stratus.rno.ebay.com!r1slrinvapi26[]
// x-content-type-options:nosniff
// x-xss-protection:1; mode=block
// cache-control:no-cache, no-store, max-age=0, must-revalidate
// pragma:no-cache
// expires:0
// x-frame-options:DENY
// content-type:application/json
// content-length:1135
// date:Sun, 20 Oct 2024 07:17:49 GMT
// x-envoy-upstream-service-time:274
// server:ebay-proxy-server
// x-ebay-pop-id:UFES2-SLCAZ01-api

//body
// {
//   "sku": "Specimen 1432",
//   "locale": "en_US",
//   "product": {
//     "title": "Heliamphora nutans 'Giant' / H. glabra x nutans - 4\" deep pot",
//     "aspects": {
//       "Climate": [
//         "Highland"
//       ],
//       "Common Name": [
//         "Pitcher Plant"
//       ],
//       "Indoor/Outdoor": [
//         "Indoor"
//       ],
//       "Growth Habit": [
//         "Clumping"
//       ],
//       "California Prop 65 Warning": [
//         "I don't have cancer yet, if that tells you anything"
//       ],
//       "Brand": [
//         "Unbranded"
//       ],
//       "Plant Form": [
//         "Rooted"
//       ],
//       "Type": [
//         "Carnivorous Plants"
//       ],
//       "Growth Stage": [
//         "Mature"
//       ],
//       "Watering": [
//         "Heavy"
//       ],
//       "Genus": [
//         "Heliamphora"
//       ],
//       "Number in Pack": [
//         "1"
//       ],
//       "Sunlight": [
//         "Full Sun"
//       ],
//       "Features": [
//         "Potted"
//       ]
//     },
//     "imageUrls": [
//       "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/gMQAAOSwirhm5eza/$_57.JPG?set_id=880000500F",
//       "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/~H4AAOSwNqBm5eza/$_57.JPG?set_id=880000500F",
//       "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/xrMAAOSwhbFm5eza/$_57.JPG?set_id=880000500F"
//     ]
//   },
//   "packageWeightAndSize": {
//     "dimensions": {
//       "width": 6,
//       "length": 12,
//       "height": 6,
//       "unit": "INCH"
//     },
//     "packageType": "PACKAGE_THICK_ENVELOPE",
//     "weight": {
//       "value": 1.75,
//       "unit": "POUND"
//     },
//     "shippingIrregular": false
//   },
//   "availability": {
//     "shipToLocationAvailability": {
//       "quantity": 1,
//       "allocationByFormat": {
//         "auction": 0,
//         "fixedPrice": 1
//       }
//     }
//   }
// }



//getOffer
//https://api.ebay.com/sell/inventory/v1/offer/543632798016

// {
//   "offerId": "543632798016",
//   "sku": "Specimen 1432",
//   "marketplaceId": "EBAY_US",
//   "format": "FIXED_PRICE",
//   "listingDescription": "<div><div><font face=\"Arial\" size=\"4\">Check out our Instagram, @DangerLettuce, for a link to our care guide and additional selection.&nbsp;</font></div><div><font face=\"Arial\" size=\"4\"><br></font></div><div><font face=\"Arial\" size=\"4\">This listing is for a Heliamphora division which was taken 09/06/24.</font></div></div><div><br></div><div><span data-sheets-root=\"1\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;Care:\\nThis would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes.  They like bright light, high humidity, low-mineral water, and good airflow.&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:6}\" style=\"font-family: Arial;\"><font size=\"4\"><span style=\"font-weight: bold;\">Care<br></span>This would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes. They like bright light, high humidity, low-mineral water, and good airflow.</font></span></div><div><span data-sheets-root=\"1\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;Care:\\nThis would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes.  They like bright light, high humidity, low-mineral water, and good airflow.&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:6}\" style=\"font-family: Arial;\"><font size=\"4\"><br></font></span></div><div><span data-sheets-root=\"1\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;Care:\\nThis would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes.  They like bright light, high humidity, low-mineral water, and good airflow.&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:6}\" style=\"\"><font face=\"Arial\" size=\"4\"><div style=\"\"><div><b>Shipping</b></div><div>Your plant will be shipped potted with plenty of cushion.</div><div>Live arrival is guaranteed.&nbsp; If you experience any issues, please take photos and contact me the day of receipt.&nbsp; I'm happy to combine shipping.</div></div></font></span></div>",
//   "pricingSummary": {
//     "price": {
//       "value": "85.0",
//       "currency": "USD"
//     }
//   },
//   "listingPolicies": {
//     "paymentPolicyId": "285168378011",
//     "returnPolicyId": "285168380011",
//     "fulfillmentPolicyId": "285168398011",
//     "eBayPlusIfEligible": false,
//     "bestOfferTerms": {
//       "bestOfferEnabled": true,
//       "autoDeclinePrice": {
//         "value": "50.01",
//         "currency": "USD"
//       }
//     }
//   },
//   "categoryId": "19617",
//   "merchantLocationKey": "US_63303",
//   "tax": {
//     "applyTax": false
//   },
//   "listing": {
//     "listingId": "135248481479",
//     "listingStatus": "ACTIVE",
//     "soldQuantity": 0
//   },
//   "status": "PUBLISHED",
//   "listingDuration": "GTC",
//   "includeCatalogProductDetails": true,
//   "hideBuyerDetails": false
// }
