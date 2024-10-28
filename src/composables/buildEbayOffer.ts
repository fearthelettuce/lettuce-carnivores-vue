export async function buildEbayOffer() {

}



// {
//   "availableQuantity": "integer",
//   "categoryId": "string",
//   "format": "FormatTypeEnum : [AUCTION,FIXED_PRICE]",
//   "listingDescription": "string",
//   "listingDuration": "ListingDurationEnum : [DAYS_1,DAYS_3,DAYS_5,DAYS_7,DAYS_10,DAYS_21,DAYS_30,GTC]",
//   "listingPolicies": {
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
//     "eBayPlusIfEligible": "boolean",
//     "fulfillmentPolicyId": "string",
//     "paymentPolicyId": "string",
//     "productCompliancePolicyIds": [
//       "string"
//     ],
//     "returnPolicyId": "string",
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
//     "takeBackPolicyId": "string"
//   },
//   "listingStartDate": "string",
//   "lotSize": "integer",
//   "marketplaceId": "MarketplaceEnum : [EBAY_US]",
//   "merchantLocationKey": "string",
//   "pricingSummary": {
//     "auctionReservePrice": {
//       "currency": "string",
//       "value": "string"
//     },
//     "auctionStartPrice": {
//       "currency": "string",
//       "value": "string"
//     },
//     "minimumAdvertisedPrice": {
//       "currency": "string",
//       "value": "string"
//     },
//     "originallySoldForRetailPriceOn": "SoldOnEnum : [ON_EBAY,OFF_EBAY,ON_AND_OFF_EBAY]",
//     "originalRetailPrice": {
//       "currency": "string",
//       "value": "string"
//     },
//     "price": {
//       "currency": "string",
//       "value": "string"
//     },
//     "pricingVisibility": "MinimumAdvertisedPriceHandlingEnum : [NONE,PRE_CHECKOUT,DURING_CHECKOUT]"
//   },
//   "tax": {
//     "applyTax": "boolean",
//     "thirdPartyTaxCategory": "string",
//     "vatPercentage": "number"
//   }
// }