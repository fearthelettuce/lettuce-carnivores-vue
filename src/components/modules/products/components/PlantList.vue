<template>

    <main class="product-list">
        <ProductCard v-for="category in plantCategories" 
            :name="category.name"
            :price="getDisplayPrice(category)"
            :link="`/plants/${encodeURIComponent(category.name)}`"
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

const {fetchAllCategories} = usePlantStore()
const {plantCategories} = storeToRefs(usePlantStore())

onMounted(async() => {
    await fetchAllCategories();
})


function getDisplayPrice(category: PlantCategory) {

    //if plant photo array length !== 0 , return index 0
    // else, look through each plant and return the first it finds
    const filteredCategories = category.plants.filter((plant) => {
        console.log(plant)
        console.log(plant.quantity > 0 && plant.status === 'Available' && plant.price !== 0)
        return plant.quantity > 0 && plant.status === 'Available' && plant.price !== 0})

    if(filteredCategories.length === 0) {return ''}
    // const min = filteredPlants.reduce((prev, curr) => {
    //     return prev.price < curr.price ? prev : curr;
    // })

    const min = Math.min(...filteredCategories.map(category => category.price))
    const max = Math.max(...filteredCategories.map(category => category.price))


    // const max = filteredPlants.reduce((prev, curr) => {
    //     return prev.price > curr.price ? prev : curr;
    // })

    if(min === max) {
        console.log(min)
        return min
    } else {
        console.log(`$${min} - ${max}`)
        return `$${min} - ${max}`
    }

}

function getCardPhoto(category: PlantCategory) {
    return ''
}

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