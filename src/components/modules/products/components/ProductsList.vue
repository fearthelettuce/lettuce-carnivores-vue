<template>
    <div class="container">

    <div class="row">
        <div 
            v-for="product of products"
            :key="product.id"
            class="col"
            >
            <ProductCard :product="product"/>
        </div>
    </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Plant } from '../types/plants'
import { getSearchResults } from '@/apis/dataServices'

const products = ref([])
onMounted(() => {
    const searchResults = getSearchResults()
    for (let result of searchResults) {
        products.value.push(result)
    }
})
</script>