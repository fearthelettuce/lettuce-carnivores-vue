import type { EbayOfferDetailsWithKeys } from '@/types/ebayApi/types'
import type { Plant, PlantCategory } from '@/types/Plant'
import { formattedDate } from '@/utils/utils'

export async function buildEbayOffer(plantCategory: PlantCategory, plant: Plant) {
    const ebayPrice = getEbayPrice(plant.price)
    if(!isValidPrice(ebayPrice)) {
        return null
    }
    const offer: EbayOfferDetailsWithKeys = {...getConstantOfferData()}
    offer.sku = plant.sku
    offer.categoryId = getCategoryId(plantCategory)
    offer.listingDescription = getListingDescription(plantCategory, plant)
    offer.pricingSummary = {
            price: {
                currency: 'USD',
                value: ebayPrice.toString()
            }
        }
    return offer
}

function getEbayPrice(price: number) {
    const markupPercent = 1.12
    if (!isValidPrice(price)) {
        return null
    }
    const markedUpPrice = price * markupPercent
    return parseFloat(markedUpPrice.toFixed(0))
}

function getCategoryId(plantCategory: PlantCategory) {
    return '19617' //"categoryName": "Plants & Seedlings"
}

function getListingDescription(plantCategory: PlantCategory, plant: Plant) {
    let text = ''
    text = `This listing is for a ${plantCategory.name} - ${plant.size}`
    if(plant.propagationDate) {
        text = text + ` which was divided on ${formattedDate(plant.propagationDate,'mm/dd/yy')}<br>`
    }
    text = text + '<br>'
    text = text + 'The plant in the photo is the actual plant for sale.<br><br>'
    if(plantCategory.genus === 'Heliamphora') {
        text = text + `<b>Care</b><br>This would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes. They like bright light, high humidity, low-mineral water, and good airflow.<br>`
        text = text + '<br>'
    }
    text = text + `<b>Shipping</b><br>`
    if(plant.size === 'Bare Root') {
        text = text + `<b>Your plant will be shipped bare root</b>.<br>`
    } else {
        text = text + `Your plant will be shipped potted.<br>`
     }
    text = text + `Live arrival is guaranteed.  If you experience any issues, please take photos and contact me the day of receipt.  I'm happy to combine shipping.`
    return text
}
function isValidPrice(price: number | null): price is number {
    if (!price || Number.isNaN(price) || price < 10 || !price) {
        return false
    }
    return true
}

function getConstantOfferData() {
    return {
        marketplaceId: 'EBAY_US',
        availableQuantity: 1,
        format: 'FIXED_PRICE',
        listingDuration: 'GTC',
        listingPolicies: {
            bestOfferTerms: {
                bestOfferEnabled: true,

            },
            eBayPlusIfEligible: false,
            fulfillmentPolicyId: '285168399011',
            paymentPolicyId: '285168378011',
            returnPolicyId: '285168380011',

        },
        merchantLocationKey: 'US_63303',
    }
}

//   "categoryId": "string",
//   "listingDescription": "string",

//   "pricingSummary": {
//     "price": {
//       "currency": "string",
//       "value": "string"
//     },
//   },
// }


//     "bestOfferTerms": {
//       "autoAcceptPrice": {
//         "currency": "string",
//         "value": "string"
//       },
//       "autoDeclinePrice": {
//         "currency": "string",
//         "value": "string"
//       },
//       "bestOfferEnabled": "boolean"
//     },

//     "shippingCostOverrides": [
//       {
//         "additionalShippingCost": {
//           "currency": "string",
//           "value": "string"
//         },
//         "priority": "integer",
//         "shippingCost": {
//           "currency": "string",
//           "value": "string"
//         },
//         "shippingServiceType": "ShippingServiceTypeEnum : [DOMESTIC,INTERNATIONAL]",
//         "surcharge": {
//           "currency": "string",
//           "value": "string"
//         }
//       }
//     ],
