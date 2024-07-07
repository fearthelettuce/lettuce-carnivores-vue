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
            <div class="plant-list mt-5">
                <PlantItem v-for="(plant, index) in plantCategoryToEdit.plants" :key="index" :plant @triggerSave="saveCategory(plantCategoryToEdit)"/>
                <div class="mt-5">
                    <button class="btn btn-primary" @click.prevent="addPlant(plantCategoryToEdit)">Add Plant Item</button>
                    <button class="btn btn-primary ms-4" @click.prevent="saveCategory(plantCategoryToEdit)">Save <span class="spinner-border" role="status" v-if="isSaving"></span></button>
                </div>
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

    <PhotoUploadModal :photos="photoModalArr" :storageFolder="photoModalFolder" ref="photoModal" @triggerSave="saveCategory(plantCategoryToEdit)"/>

</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { toast } from 'vue3-toastify'
import ProductCard from './ProductCard.vue';
import PlantForm from './PlantForm.vue';
import ItemSelect from '@/components/app/UI/ItemSelect.vue';
import PlantItem from './PlantItem.vue';
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'
import PhotoUploadModal from './photos/PhotoUploadModal.vue';
import { type PhotoItem } from '../types/product';

const {fetchAllCategories, findPlantCategoryById, setCategoryToEdit, saveCategory, addPlant,} = usePlantStore()
const {plantCategories, plantCategoryToEdit, isSaving} = storeToRefs(usePlantStore())
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

const photoModal = ref()
const photoModalFolder = ref()
const photoModalArr = ref()
function managePhotos(folder: string, arr: PhotoItem[]) {
    photoModalFolder.value = folder
    photoModalArr.value = arr
    photoModal.value.toggleModal()
}
provide('managePhotos', managePhotos)

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
    .spinner-border {
        height: 1rem;
        width: 1rem;
        margin-left: 1rem;
    }
    @media(min-width: 62rem) {
        .layout {
            grid-template-columns: 3fr 1fr;
        }
    }
</style>