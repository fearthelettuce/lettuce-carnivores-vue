import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { EbayEnvironment, AccessTokenDBResponse } from '@/types/Ebay'
import { addOrReplaceEbayInventory, deleteEbayItem, isEbayTokenExpired, postInventoryItem, refreshAccessToken } from '@/composables/useEbayUtils'
import type { Plant, PlantCategory } from '@/types/Plant'
import { findDocById } from '@/apis/dataServices'
import { unwrapResponse } from '@/utils/useFirebaseFunctions'

let ebayEnvironment = 'PRODUCTION'

export const useInventoryStore = defineStore('inventory', () => {
    const ebayTokenData: Ref<AccessTokenDBResponse | undefined> = ref(undefined)

    let environment: EbayEnvironment
    if((ebayEnvironment === 'PRODUCTION') || import.meta.env.PROD) {
        environment = 'PRODUCTION'
    } else {
        environment = 'SANDBOX'
    }

    async function addUpdateEbayItem(plant: Plant, plantCategory: PlantCategory) {
        if(!getOrRefreshEbayToken()) {
            return {success: false, message: 'Unable to refresh token'}
        }
        const res = await addOrReplaceEbayInventory(plantCategory, plant)

        if(res && 'success' in res && res.success) {
            console.log(res )
            //create a doc in Firebase Inventory
            return true
        }
        return false
    }

    async function deleteInventoryItem(sku: string) {
        if (!getOrRefreshEbayToken()) {
            return {success: false, message: 'Unable to refresh toke'}
        }

        const res = await deleteEbayItem(sku, ebayTokenData.value!.access_token)
        //update doc in db
        return unwrapResponse(res)
    }

    async function getOrRefreshEbayToken() {
        if(!ebayTokenData.value) {
            const res = await findDocById('admin', environment === 'SANDBOX' ? 'sandboxToken' : 'ebayToken')
            if(res && 'access_token' in res) {
                ebayTokenData.value = res as AccessTokenDBResponse
            }
        }

        if(!ebayTokenData.value || isEbayTokenExpired(ebayTokenData.value)) {
            const res = await refreshAccessToken(environment)
            const data = unwrapResponse(res)
            if(res.success && 'access_token' in data) {
                ebayTokenData.value = data
                return true
            } else {
                return false
            }
        }
        return true
    }


    return {addUpdateEbayItem, getOrRefreshEbayToken, ebayTokenData}
})
