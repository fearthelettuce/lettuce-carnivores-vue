import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { EbayEnvironment, AccessTokenDBResponse } from '@/types/Ebay'
import { addOrReplaceEbayInventory, isEbayTokenExpired, postInventoryItem, refreshAccessToken } from '@/composables/useEbayUtils'
import type { Plant, PlantCategory } from '@/types/Plant'
import { findDocById } from '@/apis/dataServices'

export const useInventoryStore = defineStore('inventory', () => {
    const ebayTokenData: Ref<AccessTokenDBResponse | undefined> = ref(undefined)

    let environment: EbayEnvironment
    if((import.meta.env.VITE_EBAY_ENVIRONMENT && import.meta.env.VITE_EBAY_ENVIRONMENT === 'PRODUCTION') || import.meta.env.PROD) {
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

    async function getOrRefreshEbayToken() {
        if(!ebayTokenData.value) {
            const res = await findDocById('admin', environment === 'SANDBOX' ? 'sandboxToken' : 'ebayToken')
            debugger
            if(res && 'access_token' in res) {
                ebayTokenData.value = res as AccessTokenDBResponse

            }
        }
        if(!ebayTokenData.value || isEbayTokenExpired(ebayTokenData.value)) {
            const res = await refreshAccessToken(environment)
            if('access_token' in res) {
                ebayTokenData.value = res
                return true
            } else {
                return false
            }
        }
    }


    return {addUpdateEbayItem, getOrRefreshEbayToken}
})
