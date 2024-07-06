<template>
    <Form>
        <FormKit 
            type="text"
            label="SKU"
            class="grid-col-1"
            v-model="plant.sku"
        />
        <FormKit 
            type="text"
            label="ID"
            class="grid-col-1"
            v-model="plant.id"
        />
        <FormKit 
            type="select"
            label="SKU"
            class="grid-col-1"
            :options="Sizes"
            v-model="plant.size"
        />
        <FormKit 
            type="text"
            number
            label="Regular Price"
            class="grid-col-1"
            v-model="plant.price"
        />
        <FormKit 
            type="text"
            number
            label="Discounted Price"
            class="grid-col-1"
            v-model="plant.discountedPrice"
        />
        <FormKit 
            type="checkbox"
            label="Discounted?"
            class="grid-col-1"
            v-model="plant.isDiscounted"
        />
        <FormKit 
            type="text"
            number
            label="Quantity"
            class="grid-col-1"
            v-model="plant.quantity"
        />
        <FormKit 
            type="select"
            label="Status"
            class="grid-col-1"
            :options="plantStatuses"
            v-model="plant.status"
        />
        <FormKit 
            type="date"
            label="Propagation Date"
            class="grid-col-1"
            v-model="plant.propagationDate"
        />
        <button class="btn btn-primary" @click.prevent="managePhotos">Photos</button>
    </Form>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { type Plant } from '@/types/Plant';
import { Sizes } from '@/types/Plant';


    const plant = defineModel('plant', {type: Object as PropType<Plant>, required: true})
    const plantStatuses = ['Available', 'Growing', 'Sold', 'Archived']

    function managePhotos() {
        console.log(plant.value)
    }
    // Add Photo

</script>