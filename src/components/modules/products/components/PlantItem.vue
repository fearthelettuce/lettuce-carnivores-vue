<template>
    <hr />
    <form class="plant-item-form">
        <FormKit 
            type="text"
            label="ID"
            class="grid-col-1"
            v-model="plant.id"
            @change="setRepresentative"
        />
        <FormKit 
            type="text"
            label="SKU"
            validation="required"
            validation-visibility="blur"
            class="grid-col-1"
            v-model="plant.sku"
        />
        <FormKit 
            type="select"
            label="Size"
            class="grid-col-1"
            :options="sizes"
            v-model="plant.size"
        />
        <FormKit 
            type="text"
            number
            label="Price"
            class="grid-col-1"
            v-model="plant.price"
        />
        <FormKit 
            type="text"
            number
            label="Discount Price"
            class="grid-col-1"
            v-model="plant.discountedPrice"
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
        <FormKit 
            type="checkbox"
            label="Discounted?"
            class="grid-col-1"
            outer-class="align-content-center"
            v-model="plant.isDiscounted"
        />
        <div class="center-content">
            <button class="btn btn-info" @click.prevent="addPhotos">Photos <span>({{ plant.photos.length }})</span></button>
        </div>
        
    </form>
</template>

<script setup lang="ts">
import { inject, watch, type PropType } from 'vue'
import { type Plant, type Sizes } from '@/types/Plant';

defineEmits(['triggerSave'])
const plant = defineModel('plant', {type: Object as PropType<Plant>, required: true})
const plantStatuses = ['Available', 'Growing', 'Sold', 'Archived']

const managePhotos = inject<Function>('managePhotos')

function addPhotos() {
    if(managePhotos === undefined) { return }
    managePhotos('plants', plant.value.photos)
}

function setRepresentative() {
    plant.value.isRepresentative = plant.value.id === '';
}
watch(() => plant.value.id, () => {
    if(plant.value.sku === '' && plant.value.id.toString().length === 4) {
        plant.value.sku = plant.value.id.toString()
    }
})

const sizes = [
    '2.5"',
    '3" deep',
    '3.5"',
    '3.5" deep',
    '4" deep',
    'Bare Root'
]

</script>

<style scoped>

    .plant-item-form {
        margin: 2rem 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: .5rem;
    }
    .center-content {
        justify-self: center;
        align-content: center;
    }

    
    @media(min-width: 45rem) {
        .plant-item-form {
            grid-template-columns: repeat(6, 1fr);
        }
    }
    @media(min-width: 120rem) {
        .plant-item-form {
            grid-template-columns: repeat(10, 1fr);
        }
    }

</style>