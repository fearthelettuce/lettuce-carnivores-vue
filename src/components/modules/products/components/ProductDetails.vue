<template>
    <BaseContainer>
        <section v-if="state.product" class="d-flex productDetailSection" >
        <ProductDetailsPhotoList 
            :photos="state.product.photos" 
            :photoData="state.product.photoData ?? undefined" />
            <article class="product-information d-flex align-content-center flex-column">
                <div class="d-flex justify-content-center">
                    <h1 class="text-center">{{ state.product.name }}</h1>   
                </div>
                <div>
                    <p class="text-center">{{ state.product.description }}</p>   
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <span>{{ state.product.propagationMethod }}</span>
                    <span>{{ state.product.clone }}</span>
                    <span>{{ state.product.size }}</span>
                </div>
                <div class="d-flex flex-row justify-content-around mt-3">
                    {{ formattedPrice }}
                    <button 
                    v-if="availableForSale" 
                    class="btn btn-primary"
                    @click="addToCart">
                    Add to Cart
                    </button>
                    <button 
                    v-else
                    class="btn btn-secondary"
                    disabled>
                    Out of Stock
                    </button>
                </div>       

            </article>
        </section>
        <section v-else>
            <p>Sorry, unable to find that product</p>
            <router-link to="/products">Click here to go back</router-link>
        </section>
    </BaseContainer>
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

function addToCart() {
    alert('This feature is still growing, please check back in a few days!')
}
</script>

<style scoped>
    .productDetailSection {
        flex-direction: column;
        justify-content: space-around;
    }
    .product-information {
        margin: 2rem 0;
    }

    @media (min-width: 80rem) {
    .productDetailSection {
        flex-direction: row;
    }
    .product-information {
        width: 30vw;
    }
}
</style>