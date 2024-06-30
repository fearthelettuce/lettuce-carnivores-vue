<template>

    <div class="d-flex flex-row justify-content-around my-3">
        <button v-for="size in sizes" class="btn btn-dark text-body px-4">{{ size }}</button>
    </div>
    <ItemSelect 
        label="Specimen"
        :options="specimens" 
        id="specimen-select"
        :includeCreate="false"
        />
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { type Product } from '../types/product';
import ItemSelect from '@/components/app/UI/ItemSelect.vue';

const props = defineProps({
    product: {
        type: Object as PropType<Product>,
        required: true,
    }
})
const sizes = ['2.5"', '3"', '3.5"']
const specimens = [
    {
        id: 1004,
        name: "1004",
    },
    {
        id: 1117,
        name: "1117"
    },
    {
        id: 1189,
        name: "1189"
    }
]

</script>

<style lang="scss">

</style>