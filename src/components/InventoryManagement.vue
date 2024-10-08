<template>
    <BaseContainer>
        <div class="actions">
            <BaseButton @click="accessToken">Test Access Token</BaseButton>
            <BaseButton @click="ebayLogin">Ebay Login</BaseButton>
            <BaseButton @click="refreshEbay">Refresh Ebay</BaseButton>
        </div>
    </BaseContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getEbayAccessToken, getUserConsent, refreshAccessToken } from '@/composables/useEbayUtils';
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
    const res = await refreshAccessToken()
    console.log(res)
}
</script>
<style scoped>
.actions {
    display: flex;
    flex-direction: row;
    justify-content: center;


}
</style>
