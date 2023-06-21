<template>
    <div class="container">

    <div class="row">
        <div 
            v-for="product of productStore.$state.productList"
            :key="product.id"
            class="col-3"
            >
            <ProductCard 
            :product="product"
            :cardAction="null"
            />
        </div>
    </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useProductStore } from '../stores/product'

const productStore = useProductStore()

onMounted(() => {
    productStore.fetchSearchResults()
})

</script>