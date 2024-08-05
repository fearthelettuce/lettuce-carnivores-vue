<template>
    <form class="plant-item-form">
        <FormKit 
            type="text"
            label="ID"
            class="flex-1"
            validation="required"
            v-model="plant.id"
            @change="setRepresentative"
        />
        <FormKit 
            type="text"
            label="SKU"

            class="flex-1"
            v-model="plant.sku"
        />
        <FormKit 
            type="select"
            label="Size"
            validation="required"
            class="flex-1"
            :options="sizeList"
            v-model="plant.size"
        />
        <FormKit 
            type="text"
            number
            label="Price"
            validation="required|number|min:0"
            class="flex-1"
            v-model="plant.price"
        />
        <FormKit 
            type="text"
            number
            label="Discount Price"
            class="flex-1"
            v-model="plant.discountedPrice"
        />
        <FormKit 
            type="text"
            number
            label="Quantity"
            validation="required|number|min:0"
            class="flex-1"
            v-model="plant.quantity"
        />
        <FormKit 
            type="select"
            label="Status"
            validation-visibility="live"
            class="flex-2"
            :options="statusListArr"
            v-model="plant.status"
        />
        <FormKit 
            type="date"
            label="Propagation Date"
            class="flex-2"
            v-model="plant.propagationDate"
        />
        <div>
            <FormKit
                type="checkbox"
                label="Discounted?"
                class="flex-2"
                outer-class="aligncontentcenter"
                v-model="plant.isDiscounted"
            />
            <FormKit
                type="checkbox"
                label="Representative?"
                class="flex-2"
                outer-class="aligncontentcenter"
                v-model="plant.isRepresentative"
            />
        </div>
        <div class="center-content">
            <BaseButton theme="info" class="m-1" @click.prevent="addPhotos">Photos <span>({{ plant.photos.length }})</span></BaseButton>
            <BaseButton theme="danger" class="m-1" @click.prevent="$emit('deletePlant')">Delete</BaseButton>
        </div>
        
    </form>
</template>

<script setup lang="ts">
import { inject, watch, type PropType } from 'vue'
import { type Plant } from '@/types/Plant';
import { sizeList, statusListArr} from '@/constants/constants';

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
        margin: 1rem 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        /* display: grid;
        grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr)); */
        gap: .5rem;
    }
    .center-content {
        justify-self: center;
        align-content: center;
    }
    .flex-1 {
        display: flex;
        flex: 1;
    }
    .flex-2 {
        display: flex;
        flex: 2;
    }


</style>