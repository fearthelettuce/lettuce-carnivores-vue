<template>
    <div>
        <div v-if="state.product">
            <h1>{{ state.product.name }}</h1>
            <p>{{ formattedPrice }}</p>
            <aside>
                <ProductDetailsPhotoList :photos="state.product.photos" :photoData="state.product.photoData? state.product.photoData : undefined" />
            </aside>
            <div>
                <button 
                v-if="availableForSale" 
                class="btn btn-primary">
                Add to Cart
                </button>
                <button 
                v-else
                class="btn btn-secondary"
                disabled>
                Out of Stock
                </button>
            </div>       
        </div>
        <div v-else>
            <p>Sorry, unable to find that product</p>
            <router-link to="products">Click here to go back</router-link>
        </div>
</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
import type {Product} from '@/components/modules/products/types/product'
import ProductDetailsPhotoList from './ProductDetailsPhotoList.vue'

const route = useRoute()
const productStore = useProductStore()

const state = reactive({
    isLoading: false,
    product: null as null | Product,
})

onMounted(() => {
    fetchData()
})


async function fetchData() {
    state.isLoading = true;
    const productData = await productStore.findProductById(Number(route.params.id))
    if(productData) {
        console.log(productData)
        state.product = productData
    }
    state.isLoading = false;
}

const availableForSale = computed(() => {
    if(!state.product) return false
    if(!state.product.isForSale || state.product.quantity === 0 || state.product.price == 0 || state.product.price < 0 || !state.product.price ) return false
    return true
})

const formattedPrice = computed(() => {
    if(!state.product) return '-'
    if(state.product.price == 0 || state.product.price < 0 || !state.product.price ) return '-'
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })
    return formatter.format(state.product.price)
})

</script>

<style scoped>

</style>