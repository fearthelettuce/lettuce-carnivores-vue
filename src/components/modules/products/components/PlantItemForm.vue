<template>
    <hr />
    <form class="plant-item-form">
        <FormKit 
            type="text"
            label="ID"
            class="grid-col-1"
            validation="required"
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
            validation="required"
            class="grid-col-1"
            :options="sizeList"
            v-model="plant.size"
        />
        <FormKit 
            type="text"
            number
            label="Price"
            validation="required|number|min:0"
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
            validation="required|number|min:0"
            class="grid-col-1"
            v-model="plant.quantity"
        />
        <FormKit 
            type="select"
            label="Status"
            validation="not:'Coming Soon'"
            validation-visibility="live"
            class="grid-col-1"
            :options="statusListArr"
            v-model="plant.status"
        />
        <FormKit 
            type="date"
            label="Propagation Date"
            class="grid-col-1"
            v-model="plant.propagationDate"
        />
        <div>
            <FormKit
                type="checkbox"
                label="Discounted?"
                class="grid-col-1"
                outer-class="align-content-center"
                v-model="plant.isDiscounted"
            />
            <FormKit
                type="checkbox"
                label="Representative?"
                class="grid-col-1"
                outer-class="align-content-center"
                v-model="plant.isRepresentative"
            />
        </div>
        <div class="center-content">
            <button class="btn btn-info m-1" @click.prevent="addPhotos">Photos <span>({{ plant.photos.length }})</span></button>
            <button class="btn btn-danger m-1" @click.prevent="$emit('deletePlant')">Delete</button>
        </div>
        
    </form>
</template>

<script setup lang="ts">
import { inject, watch, type PropType } from 'vue'
import { type Plant } from '@/types/Plant';
import { statusList, sizeList, statusListArr} from '@/constants/constants';
import { newPlant } from '@/constants/constants';
import { usePlantStore } from '@/components/modules/products/stores/plant'
import { toast } from 'vue3-toastify'

defineEmits(['triggerSave', 'deletePlant'])

const plant = defineModel('plant', {type: Object as PropType<Plant>, required: true})

watch(
    () => plant.value,
    () =>{
        if(!plant.value.status && !statusListArr.includes(plant.value.status)) {
            alert(`Plant ${plant.value.id}/${plant.value.sku} value for status does not match options in statusListArr `)
        }
        if(!plant.value.size && !statusListArr.includes(plant.value.status)) {
            alert(`Plant ${plant.value.id}/${plant.value.sku} value for status does not match options in statusListArr `)
        } 
    },
    { immediate: true }
)
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