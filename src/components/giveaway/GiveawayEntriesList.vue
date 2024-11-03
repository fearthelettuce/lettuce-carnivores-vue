<template>
    <div v-for="entry in giveawayEntries">
        <div>
            {{ formatDisplayName(entry.displayName) }}
        </div>
            <div>Email: {{ entry.email }}</div>
            <div>Insta: {{ entry.instagram }}</div>
            <div>Face: {{ entry.facebook }}</div>
    </div>

</template>

<script setup lang="ts">

import { onMounted, ref, type Ref } from 'vue'
import { findAll, findDocById } from '@/apis/dataServices'
const giveawayCollectionName = 'giveaways'
const giveawayEntries: Ref<any[]> = ref([])
async function getGiveawayEntries() {
    return findAll('giveawayEntries')
}
onMounted(async () => {
    const res = await getGiveawayEntries()
    if(res) {
        giveawayEntries.value = res
    }
})
function formatDisplayName(name: string) {
    if(!name) {return}
    const names = name.trim().toString().split(" ")
    if(names.length === 1) {
        return names[0]
    }

    return `${names[0]} ${names[1][0]}`

}
</script>
