<template>
    <div class="container-fluid layout"> 
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
                        <PlantCategoryForm />
                    </div>
                </Transition>
                <button class="btn btn-secondary" @click="toggleExpand"> {{isExpanded ? 'Hide Form' : `Edit ${plantCategoryToEdit.name !== '' ? plantCategoryToEdit.name : 'Category'}`  }}</button>
                
            </div>
            <div class="plant-list mt-5">
                <PlantItem v-for="(plant, index) in plantCategoryToEdit.plants" :key="index" :plant @triggerSave="saveCategory(plantCategoryToEdit)" @deletePlant="removePlant(index)"/>
                <div class="mt-5">
                    <button class="btn btn-primary" @click.prevent="addPlant(plantCategoryToEdit)">Add Plant Item</button>
                    <button class="btn btn-primary ms-4" @click.prevent="save">Save <span class="spinner-border" role="status" v-show="isSaving"></span></button>
                </div>
            </div>
        </div>
        <div class="product-list">
            <ProductCard
                :name="getCardName(plantCategoryToEdit)"
                :price="getDisplayPrice(plantCategoryToEdit, getAvailablePlants(plantCategoryToEdit))"
                :link="`/plants/${encodeURIComponent(plantCategoryToEdit.id)}`"
                :photoUrl="getCardPhoto(plantCategoryToEdit)"
                class="product-card"
            />
        </div>
    </div>

    <PhotoUploadModal :photos="photoModalArr" :storageFolder="photoModalFolder" ref="photoModal" @triggerSave="saveCategory(plantCategoryToEdit)"/>

</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { toast } from 'vue3-toastify'
import ProductCard from './ProductCard.vue';
import PlantCategoryForm from './PlantCategoryForm.vue';
import ItemSelect from '@/components/app/UI/ItemSelect.vue';
import PlantItem from './PlantItem.vue';
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'
import PhotoUploadModal from './photos/PhotoUploadModal.vue';
import { type PhotoItem } from '../../../../types/Product';
import { getCardName, getDisplayPrice, getCardPhoto } from '@/composables/useCardUtils';

const {fetchAllCategories, findPlantCategoryById, setCategoryToEdit, saveCategory, addPlant, getAvailablePlants, removePlant} = usePlantStore()
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

async function save() {
    console.log(isSaving.value)
    await saveCategory(plantCategoryToEdit.value)
    console.log(isSaving.value)
}

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
    .product-list {
        display: grid;
        gap: .5rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        margin: 2rem .5rem;
    }

    @media(min-width: 82rem) {
        .product-list {
            grid-template-columns: repeat(auto-fit, minmax(26rem, 1fr));
            gap: 1rem;
        }
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