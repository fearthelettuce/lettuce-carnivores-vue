<template>
    <form class="plant-item-form">
        <FormKit
            type="text"
            label="ID"
            outer-class="flex-1"
            validation="required"
            v-model="plant.id"
            @change="setRepresentative"
        />
        <FormKit
            type="text"
            label="SKU"
            outer-class="flex-1"
            v-model="plant.sku"
        />
        <FormKit
            type="select"
            label="Size"
            validation="required"

            :options="sizeList"
            v-model="plant.size"
        />
        <FormKit
            type="text"
            number
            label="Price"
            validation="required|number|min:0"
            outer-class="flex-1"
            v-model="plant.price"
        />
        <FormKit
            type="text"
            number
            label="Quantity"
            validation="required|number|min:0"
            outer-class="flex-1"
            v-model="plant.quantity"
        />
        <FormKit
            type="select"
            label="Status"
            validation-visibility="live"
            :options="statusListArr"
            v-model="plant.status"
        />
        <FormKit
            type="text"
            label="Shelf"
            outer-class="flex-1"
            v-model="plant.shelfLocation"
        />
        <FormKit
            type="date"
            label="Propagation Date"

            v-model="plant.propagationDate"
        />
        <div class="other-stuff">
            <FormKit
                type="checkbox"
                label="Representative?"
                class=""
                outer-class="flex-2 align-content-center"
                v-model="plant.isRepresentative"
            />
            <div>
                {{ `Photo: ${mostRecentPhoto}` }}
            </div>
        </div>
        <div class="actions">
            <BaseButton @click.prevent="addPhotos">Photos <span>({{ plant.photos.length }})</span></BaseButton>
            <BaseButton type="danger" @click.prevent="$emit('deletePlant')" :disabled="plant.status !== 'Delete'">Delete</BaseButton>
            <BaseButton @click.prevent="$emit('createEbayItem')">Create Ebay Item</BaseButton>
        </div>

    </form>
</template>

<script setup lang="ts">
import { computed, inject, watch, type PropType } from 'vue'
import { type Plant } from '@/types/Plant';
import { sizeList, statusListArr} from '@/constants/constants';
import { formatFirebaseDate, formattedDate } from '@/utils/utils'

defineEmits(['triggerSave', 'deletePlant', 'createEbayItem'])

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

const mostRecentPhoto = computed(() => {
    const photoDates = plant.value.photos.map(photo => photo.date)
    if(photoDates.length > 0) {
        const mostRecentDate = photoDates.reduce((a, b) => {return a > b ? a : b})
        return formatFirebaseDate(mostRecentDate)
    }
    return '-'
})
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
        margin: .25rem 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        /* display: grid;
        grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr)); */
        gap: .5rem;
    }
    .actions {
        display: flex;
        gap: .5rem;
        justify-self: center;
        align-content: center;
        margin: 1rem 0 1rem .5rem;
    }
    .flex-1 {
        display: flex;
        flex: 1;
    }
    .flex-2 {
        display: flex;
        flex: 2;
    }
    .other-stuff {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: .1rem 0;
    }

</style>
