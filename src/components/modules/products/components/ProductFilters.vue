<template>
    <div class="filter-container">
        <div v-for="category in filterCategories" :key="category.label">


        </div>
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

</template>

<script setup lang="ts">


const filterCategories = [
    {
        label: 'Genus',
        options: [
            {
                label: 'Heliamphora',
                value: true,
                visible: true,
            },
            {
                label: 'Nepenthes',
                value: true,
                visible: true,
            },
            {
                label: 'Cephalotus',
                value: true,
                visible: true,
            },
        ],
    },
    {
        label: 'Availability',
        options: [
            {
                label:'In-Stock',
                value: true,
                visible: true,
            },
            {
                label: 'Coming Soon',
                value: false,
                visible: true,
            },
            {
                label: 'Archived',
                value: false,
                visible: true,
            }
        ],
    }
]

//Size - 2.5, 3.0, 3.5, 3.5d, etc.
//Specimen vs Represenatative
//Species vs Hybrid
//Conditions Highland vs Intermediate
//On Sale?
//Experience
//Recommended for beginner
//Expanding Collection
//Hardcore Collector

//Sort:
//Name A-Z Z-A
//Price $ - $$$$
//Popular?
//Size Big - Small Small - Big

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

<style scoped>

.filter-container {
    display: flex;
}
</style>