<template>
    <div>
        
        <ItemSelect :options="plantCategories" 
            v-model="plantCategoryToEdit" 
            id="selectProduct" 
            label="Select a product to edit" 
            :includeCreate="true"
        />
        <div class="mt-4">
            <PlantForm />
        </div>
    </div>
    <div>
        <ProductCard :product="plantCategoryToEdit" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';
import PlantForm from './PlantForm.vue';
import ItemSelect from '@/components/app/UI/ItemSelect.vue';
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'

const {fetchAllCategories, findPlantCategoryById, setCategoryToEdit} = usePlantStore()
const {plantCategories, plantCategoryToEdit} = storeToRefs(usePlantStore())
const route = useRoute()

onMounted(async () => {
    await fetchAllCategories()

    //TODO: find a way to change nav to exclude :id without messy custom lgoic, and then change this to === undefined or null
    if(route.params.id !== ":id") {
        const plantCategory = await findPlantCategoryById(route.params.id as string)
        console.log(plantCategory)
        setCategoryToEdit(plantCategory)
    } else {
        setCategoryToEdit(null)
    }
    
})
</script>
