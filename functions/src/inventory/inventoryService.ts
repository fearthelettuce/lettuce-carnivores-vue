import admin from 'firebase-admin'
import { deleteEbayInventoryItem } from '../ebay/ebayData'
import type { Plant } from '../types/Plants'
import { getCategoryBySku } from '../common'
import { StripeLineItem } from '../types/Stripe'
import { error } from 'firebase-functions/logger'

export async function updateInventoryFromStripeSale(items: StripeLineItem[]) {
    for (const item of items) {
        const productData = item.price_data.product_data.metadata
        await updateEbayInventory(productData.sku, true)
        await updateWebsiteInventory(productData.sku, productData.categoryId, item.quantity)
    }
    return
}

export async function updateInventoryFromEbaySale(sku: string, deleteFromEbay: boolean = true) {
    const skus: string[] = []
    if(sku.includes(',')) {
        skus.concat(sku.split(','))
    } else {
        skus.push(sku)
    }
    for(const sku of skus) {
        const docRef = admin.firestore().collection('inventory').doc(sku)
        const data = (await docRef.get()).data()
        const plantCategory = data?.plantCategory ?? undefined
        await updateEbayInventory(sku, deleteFromEbay)
        await updateWebsiteInventory(sku, plantCategory)
    }
    return
}

export async function updateEbayInventory(sku: string, deleteFromEbay: boolean) {
    const docRef = admin.firestore().collection('inventory').doc(sku)
    if(deleteFromEbay) {
        const res = await deleteEbayInventoryItem(sku)
        if(!res || !res.success) {
            docRef.update({status: 'error', error: 'Attempt to delete from eBay failed'})
            return false
        }
    }
    await docRef.delete().catch((e) => {console.log(e); return false})
    return true
}

async function updateWebsiteInventory(sku: string, plantCategoryId?: string, quantity: number = 1) {
    const categoryId = plantCategoryId ?? getCategoryBySku(sku)
    const docRef = admin.firestore().doc(`plantCategories/${categoryId}`)
    const doc = await docRef.get()
    const plantCategory = doc?.data()
    if(!plantCategory) {
        error(`Unable to get plantCategory data when updating website inventory for SKU ${sku}`)
        return false
    }
    const plantIndex = plantCategory.plants.findIndex((plant: Plant ) => plant.sku === sku)
    const plant = plantCategory.plants[plantIndex]
    if(plant.quantity === 1 || quantity > plant.quantity) {
        plantCategory.plants[plantIndex].status = 'Sold'
        plantCategory.plants[plantIndex].quantity = 0
    } else {
        plantCategory.plants[plantIndex].quantity = plant.quantity - quantity
    }
    await docRef.update({plants: plantCategory.plants})
    return true
}
