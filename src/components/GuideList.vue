<template>
    <main class="guide-container">
        <GuideCard 
            v-for="(value, name, index) in guideData.genus"
            :key="name" 
            :care-data="value"
            :alt-style="index % 2 !== 0 ? true : false" 
        />
    </main>
</template>
<script setup lang="ts">
import GuideCard from '@/components/GuideCard.vue'
import { guideData }  from '@/apis/CareData'


// quick reference option
// fresh divisions
// bag method
</script>

<style scoped>
.guide-container {
    padding: 0 clamp(.1em, 6vw, 20rem)
}
</style>
