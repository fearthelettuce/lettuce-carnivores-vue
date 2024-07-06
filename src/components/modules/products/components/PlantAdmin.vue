<template>
    <div class="layout"> 
        <div>
            <ItemSelect 
                :options="plantCategories" 
                v-model="plantCategoryToEdit" 
                id="selectProduct" 
                label="Select a product to edit" 
                :includeCreate="true"
            />
            <div class="mt-4">
                <Transition name="slide-up">
                    <div v-if="isExpanded">
                        <PlantForm />
                    </div>
                </Transition>
                <button class="btn btn-secondary" @click="toggleExpand"> {{isExpanded ? 'Hide Form' : `Edit ${plantCategoryToEdit.name !== '' ? plantCategoryToEdit.name : 'Category'}`  }}</button>
                
            </div>
        </div>
        <div>
            <ProductCard
                :name="plantCategoryToEdit.name"
                :price=" 0" 
                :photoUrl="plantCategoryToEdit.photos[0]?.path ?? undefined"
                :link="`/plants/${plantCategoryToEdit.id}`"
            />
        </div>
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


const isExpanded = ref(true)
function toggleExpand () {
    isExpanded.value = !isExpanded.value
}

</script>
<style scoped>
    .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0 2rem;
    }
    .slide-up-enter-active,
    .slide-up-leave-active {
    transition: all 0.5s ease-out;
    }

    .slide-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
    }

    .slide-up-leave-to {
    opacity: 0;
    transform: translateY(-30px);
    }

    @media(min-width: 62rem) {
        .layout {
            grid-template-columns: 2fr 1fr;
        }
    }
</style>