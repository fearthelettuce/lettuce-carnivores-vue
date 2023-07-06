<template>
    <div>
        <div v-if="state.product">
            <h1>{{ state.product.name }}</h1>
            <p>{{$route.params.id}}</p>        
        </div>
        <div v-else>
            <p>Sorry, unable to find that product</p>
            <router-link to="products">Click here to go back</router-link>
        </div>
</div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
const route = useRoute()
const productStore = useProductStore()

const state = reactive({
    isLoading: false,
    product: null,
})
onMounted(() => {
    fetchData()
})
watch(
    () => route.params.id,
    () => {
        fetchData()
    }
)

async function fetchData() {
    state.isLoading = true;
    productStore.findProductById(Number(route.params.id)).then((res) => {
        if(res) {
            console.log(res)
            state.product = res
        }
    })
    state.isLoading = false;

}
</script>

<style scoped>

</style>