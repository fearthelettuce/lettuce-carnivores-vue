<template>
    <BaseButton @click="clickHandler">Test</BaseButton>

</template>

<script setup lang="ts">
import { testEbay } from '@/composables/useEbayUtils';

async function clickHandler() {
    const res = await testEbay()
    console.log(res.data.access_token)
}
</script>