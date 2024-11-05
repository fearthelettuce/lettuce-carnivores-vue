import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { AccessTokenDBResponse } from '@/types/Ebay'
import { addOrReplaceEbayInventory, deleteEbayItem, postOffer } from '@/composables/useEbayUtils'
import type { Plant, PlantCategory } from '@/types/Plant'
import { unwrapResponse } from '@/utils/useFirebaseFunctions'

export const useInventoryStore = defineStore('inventory', () => {
    const ebayTokenData: Ref<AccessTokenDBResponse | undefined> = ref(undefined)
    const isLoading: Ref<boolean> = ref(false)


    async function addUpdateEbayItem(plant: Plant, plantCategory: PlantCategory) {
        isLoading.value = true
        const res = await addOrReplaceEbayInventory(plantCategory, plant)
        isLoading.value = false

        if(res && 'success' in res && res.success) {
            console.log(res)
            return true
        }
        return false
    }

    async function listOnEbay(plantCategory: PlantCategory, plant: Plant) {
        isLoading.value = true
        const res = await postOffer(plantCategory, plant)
        isLoading.value = false
        console.log(res )
        if(res && 'success' in res && res.success) {
            return true
        }
        return false
    }

    async function deleteItem(sku: string) {
        const res = await deleteEbayItem(sku)
        return unwrapResponse(res)
    }

    // async function getOrRefreshEbayToken() {
    //     if(!ebayTokenData.value) {
    //         const res = await findDocById('admin', environment === 'SANDBOX' ? 'sandboxToken' : 'ebayToken')
    //         if(res && 'access_token' in res) {
    //             ebayTokenData.value = res as AccessTokenDBResponse
    //         }
    //     }
    //     if(!ebayTokenData.value || isEbayTokenExpired(ebayTokenData.value)) {
    //         const res = await refreshAccessToken(environment)
    //         const data = unwrapResponse(res)
    //         if(res.success && 'access_token' in data) {
    //             ebayTokenData.value = data
    //             return true
    //         } else {
    //             return false
    //         }
    //     }
    //     return true
    // }


    return {addUpdateEbayItem, listOnEbay, ebayTokenData, deleteItem}
})
