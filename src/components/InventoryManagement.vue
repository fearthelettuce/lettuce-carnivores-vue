<template>
    <BaseContainer>
        <div class="actions">
            <BaseButton @click="accessToken">Test Access Token</BaseButton>
            <BaseButton @click="ebayLogin">Ebay Login</BaseButton>
            <BaseButton @click="refreshEbay">Refresh Ebay</BaseButton>
        </div>
        <div>{{ `${environment} - Token refreshed: ${ebayTokenIssued}` }}</div>
        <div>
            <FormKit
                type="text"
                label="Ebay SKU"
                outer-class="grid-col-2"
                v-model="ebaySkuInput"
            />
            <BaseButton @click="getInventoryBySku">Get Inventory</BaseButton>
        </div>
    </BaseContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getEbayAccessToken, getUserConsent, refreshAccessToken, getInventoryItem, isSuccess } from '@/composables/useEbayUtils';
import type { EbayEnvironment, AccessTokenDBResponse } from '@/types/Ebay'
import BaseDialog from '@/components/UI/BaseDialog.vue';
import { toast } from 'vue3-toastify'
import { findDocById } from '@/apis/dataServices'
import { getPhotoDownloadUrl } from '@/apis/fileServices'
const ebayTokenIssued = ref('')
const environment = import.meta.env.VITE_EBAY_ENVIRONMENT
onMounted(async ()=>{
    getLastTokenDate()
    getPhotoDownloadUrl(undefined)
})

async function getLastTokenDate() {
    const res = await findDocById('admin', environment === 'SANDBOX' ? 'sandboxToken' : 'ebayToken')
    ebayTokenIssued.value = res?.updatedDateTime
}
async function accessToken() {
    const res = await getEbayAccessToken().catch(e => {console.error(e); return})
    console.log(res)
}

async function ebayLogin() {
    const res = await getUserConsent().catch(e => {console.error(e); return})
    console.log(res)
    if(res) {
        window.open(res)
    }
}

async function refreshEbay() {
    const res = await refreshAccessToken()
    console.log(res)
    if(res && res.success) {
        toast.success('Ebay token refreshed')
        ebayTokenIssued.value = res.data.updatedDateTime
    } else {
        toast.error('Something went wrong')
        console.error(res)
    }
}

const ebaySkuInput = ref('')
async function getInventoryBySku() {
    const res = await getInventoryItem(ebaySkuInput.value)
    console.log(res)

}

// async function deleteListing() {
//     if(ebaySkuInput.value && ebaySkuInput.value.length > 3) {
//         const res = await deleteEbayItem(ebaySkuInput.value)
//         console.log(res)
//     }
// }
</script>
<style scoped>
.actions {
    display: flex;
    flex-direction: row;
    justify-content: center;


}
</style>
