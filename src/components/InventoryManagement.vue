<template>
    <BaseContainer>
        <div class="actions">
            <BaseButton @click="accessToken">Access Token</BaseButton>
            <BaseButton @click="ebayLogin">Ebay Login</BaseButton>
        </div>
        <div>{{ `${environment} - Token refreshed: ${ebayTokenData?.updatedDateTime}` }}</div>
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
import { getEbayAccessToken, getUserConsent } from '@/composables/useEbayUtils';
import { toast } from 'vue3-toastify'
import { useInventoryStore } from '@/stores/inventory'
import { storeToRefs } from 'pinia'

let environment = 'PRODUCTION'
const { ebayTokenData } = storeToRefs(useInventoryStore())

async function accessToken() {
    const res = await getEbayAccessToken().catch(e => {console.error(e); return})
    console.log(res)
}

async function ebayLogin() {
    const res = await getUserConsent()
    if(res.success && res.data) {
        window.open(res.data)
    } else {
        toast.error('Something went wrong')
    }
}


const ebaySkuInput = ref('')
async function getInventoryBySku() {
    // const res = await getInventoryItem(ebaySkuInput.value)
    // console.log(res)

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
