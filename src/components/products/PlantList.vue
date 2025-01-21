<template>
    <div class="product-list">
        <ProductCard v-for="category in filteredCategories" 
            :name="getCardName(category)"
            :price="getDisplayPrice(category, getAvailablePlants(category))"
            :link="`/plants/${encodeURIComponent(category.id)}`"
            :photoUrl="getCardPhoto(category)"
            />
    </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/products/ProductCard.vue'
import { usePlantStore } from '@/stores/plant'
import { onMounted } from 'vue';
import { getCardName, getDisplayPrice, getCardPhoto } from '@/composables/useCardUtils';
import { storeToRefs } from 'pinia'

const {fetchAllCategories, getAvailablePlants, updateFilteredCategories} = usePlantStore()
const { filteredCategories } = storeToRefs(usePlantStore())
onMounted(async () => {
    await fetchAllCategories();
    updateFilteredCategories()
    const pageTitle = 'Danger Lettuce Carnivores'
    document.title = pageTitle
    const descEle = document.querySelector('head meta[name="description"]');
    descEle?.setAttribute('content', `Danger Lettuce Carnivores specializes in offering mature Heliamphora divisions at great prices.`);
})

</script>

<style scoped>
    .product-list {
        display: grid;
        gap: .5rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        width: 100%;
    }

    @media(min-width: 82rem) {
        .product-list {
            grid-template-columns: repeat(auto-fit, minmax(26rem, 1fr));
            gap: 1rem;
        }
    }
</style>