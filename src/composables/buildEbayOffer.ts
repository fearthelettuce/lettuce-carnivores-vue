import type { Plant, PlantCategory } from '@/types/Plant'

export async function buildEbayOffer(plantCategory: PlantCategory, plant: Plant) {
    const ebayPrice = getEbayPrice(plant.price)
    if(!isValidPrice(ebayPrice)) {
        return null
    }


}

function getEbayPrice(price: number) {
    const markupPercent = 1.12
    if (!isValidPrice(price)) {
        return null
    }
    const markedUpPrice = price * markupPercent
    return parseFloat(markedUpPrice.toFixed(0))

}

function isValidPrice(price: number | null) {
    if (!price || Number.isNaN(price) || price < 10 || !price) {
        return false
    }
    return true
}

function getConstantOfferData() {
    return {
        categoryId: undefined,
        listingDescription: undefined,
        marketplaceId: 'EBAY_US',
        availableQuantity: 1,
        format: 'FIXED_PRICE',
        listingDuration: 'GTC',
        listingPolicies: {
            bestOfferTerms: {
                bestOfferEnabled: true,

            },
            eBayPlusIfEligible: false,
            fulfillmentPolicyId: 'NEED',
            paymentPolicyId: 'NEED',
            returnPolicyId: 'NEED',

        },
        merchantLocationKey: 'NEED',
        pricingSummary: {
            price: {
                currency: 'USD',
                value: undefined
            }
        }

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
