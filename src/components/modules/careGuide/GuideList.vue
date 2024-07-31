<template>
    <main class="container-fluid guide-container">
        <GuideCard 
            v-for="(value, name, index) in careInfo.genus"
            :key="name" 
            :care-data="value"
            :alt-style="index % 2 !== 0 ? true : false" 
        />
    </main>
</template>
<script setup lang="ts">
import GuideCard from './GuideCard.vue'
import careData from './CareData'
const careInfo = careData.guideData


// quick reference option
// fresh divisions
// bag method
</script>

<style scoped>
.guide-container {
    padding: 0 clamp(.1em, 6vw, 20rem)
}
</style>
