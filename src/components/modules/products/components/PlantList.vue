<template>

    <main class="product-list">
        <ProductCard v-for="category in plantCategories" 
            :name="getCardName(category)"
            :price="getDisplayPrice(category, getAvailablePlants(category))"
            :link="`/plants/${encodeURIComponent(category.id)}`"
            :photoUrl="getCardPhoto(category)"
            />
    </main>
    

</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import { usePlantStore } from '../stores/plant'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import type { PlantCategory } from '@/types/Plant';
import { getCardName, getDisplayPrice, getCardPhoto } from '@/composables/useCardUtils';

const {fetchAllCategories, getAvailablePlants} = usePlantStore()
const {plantCategories} = storeToRefs(usePlantStore())

onMounted(async() => {
    await fetchAllCategories();
})

// function getCardName(category: PlantCategory) {
//     if(category.clone === undefined || !category.clone || category.clone === '') {
//         return category.name
//     } else {
//         return `${category.name} - ${category.clone}`
//     }
// }
// function getDisplayPrice(category: PlantCategory) {
//     const availablePlants = getAvailablePlants(category)
//     if(availablePlants.length === 0) {return ''}

//     const min = Math.min(...availablePlants.map(category => category.price))
//     const max = Math.max(...availablePlants.map(category => category.price))
//     return min === max ? min : `$${min} - ${max}`
// }

// function getCardPhoto(category: PlantCategory) {
//     if(category.photos.length !== 0) {
//         return category.photos[0].path
//     }
//     if(category.plants.length !== 0) {
//         let plantPath: undefined | string = undefined
//         category.plants.forEach(plant => {
//             if(plantPath === undefined && plant.photos.length !== 0) {
//                 plantPath = plant.photos[0].path
//             }
//         });
//         return plantPath
//     }

// }

</script>

<style scoped>
    .product-list {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));

    }
    .dummy-card {
        background: salmon;
    }
</style>