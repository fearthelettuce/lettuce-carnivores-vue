<template>
    <BaseContainer>
        <div class="actions">
            <BaseButton @click="accessToken">Test Access Token</BaseButton>
            <BaseButton @click="ebayLogin">Ebay Login</BaseButton>
            <BaseButton @click="refreshEbay">Refresh Ebay</BaseButton>
            <BaseButton @click="getListings">Get Listings</BaseButton>
        </div>
        <div>
            <FormKit
                type="text"
                label="Ebay SKU"
                outer-class="grid-col-2"
                v-model="ebaySkuInput"
            />
            <BaseButton @click="deleteListing">Delete</BaseButton>
        </div>
    </BaseContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getEbayAccessToken, getUserConsent, refreshAccessToken, getEbayListings, deleteEbayItem } from '@/composables/useEbayUtils';
import BaseDialog from '@/components/UI/BaseDialog.vue';
import { toast } from 'vue3-toastify'

async function accessToken() {
    const res = await getEbayAccessToken().catch(e => {console.error(e); return})
    console.log(res)
}

async function ebayLogin() {
    const res = await getUserConsent().catch(e => {console.error(e); return})

    console.log(res)
    if(res && res.data) {
        window.open(res.data as string)
    } else {
        toast.error('Unable to get ebay sign in URL')
    }
}

async function refreshEbay() {
    const res: any = await refreshAccessToken()
    if(res && res.data.success === true) {
        toast.success('Ebay token refreshed')
    } else {
        toast.error('Something went wrong')
        console.error(res)
    }
}
async function getListings() {
    const res = await getEbayListings()
    console.log(res)

}

const ebaySkuInput = ref('')
async function deleteListing() {
    if(ebaySkuInput.value && ebaySkuInput.value.length > 3) {
        const res = await deleteEbayItem(ebaySkuInput.value)
        console.log(res)
    }
}
</script>
<style scoped>
.actions {
    display: flex;
    flex-direction: row;
    justify-content: center;


}
</style>
