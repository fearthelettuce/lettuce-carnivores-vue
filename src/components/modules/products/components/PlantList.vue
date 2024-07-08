<template>
    <main class="product-list">
        <ProductCard v-for="category in availableCateogires" 
            :name="getCardName(category)"
            :price="getDisplayPrice(category, getAvailablePlants(category))"
            :link="`/plants/${encodeURIComponent(category.id)}`"
            :photoUrl="getCardPhoto(category)"
            />
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from './ProductCard.vue'
import { usePlantStore } from '../stores/plant'
import { onMounted } from 'vue';
import { getCardName, getDisplayPrice, getCardPhoto } from '@/composables/useCardUtils';

const {fetchAllCategories, getAvailablePlants, getAvailableCategories} = usePlantStore()

onMounted(async() => {
    await fetchAllCategories();
})

const availableCateogires = computed(() => {
    return getAvailableCategories()
})

</script>

<style scoped>
    .product-list {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        margin: 1rem 1rem;
    }
    @media(min-width: 60rem) {
        .product-list {
            margin: 1rem 5dvw;
        }
    }
</style>