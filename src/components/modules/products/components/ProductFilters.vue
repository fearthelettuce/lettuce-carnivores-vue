<template>
    <form>
        <div class="container">
            <!-- <div class="row my-4 g-3 align-items-center ">
                <div class="btn-group col-6" role="group" aria-label="Select genus filters">
                    <label v-for="genus of productStore.getGenusList" :key="genus.id" class="btn btn-outline-primary" :for="genus.label"  @click="filterByGenus()">
                    <input type="checkbox" class="btn-check" :name="genus.label" :id="genus.id" autocomplete="off" v-model="filters.genus">
                        {{ genus.label }}</label>
                </div>
                <div class="col-auto">
                    <select name="editProduct" class="form-select" aria-label="Select a product to edit" @change="getProductDetails" v-model="productToEdit">
                        <option id="placeholder" selected disabled value="">Select a product to edit</option>
                        <option v-for="product of products" :value="product.id" :key="product.id" >{{ product.name }} ({{ product.id }})</option>
                    </select>
                </div>
            </div> -->
        </div>
    </form>
</template>

<script setup lang="ts">
// import { reactive } from 'vue';
// import { useProductStore } from '../stores/product'

// const productStore = useProductStore()
// const filters = reactive({
//     genus: []
// })


//Design:
// Product Store
// Set fitler - takes in a filter type and filter criteria
// loop through products and apply filter
// Need an array/obj of filters and criteria

</script>

