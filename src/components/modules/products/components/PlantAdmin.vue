<template>
    <ItemSelect :options="plantCategories" 
        v-model="plantToEdit" 
        id="selectProduct" 
        label="Select a product to edit" 
        :includeCreate="true"
    />
    <PlantForm />

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PlantForm from './PlantForm.vue';
import ItemSelect from '@/components/app/UI/ItemSelect.vue';
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';


const plantToEdit = ref()

const {fetchAllCategories} = usePlantStore()
const {plantCategories} = storeToRefs(usePlantStore())

onMounted(() => {
    fetchAllCategories()
})
</script>

