<template>
    <div class="my-2 ms-5">{{`Total Inv: ${currentAvailablePlants.totalAvailable} --- 
    Heli Count : ${currentAvailablePlants.heliCount} ---
    Heli Varieties: ${currentAvailablePlants.heliVarieties}
    `}}</div>
    <div class="container-fluid layout"> 
        
        <div>
            <ItemSelect 
                :options="plantCategories" 
                v-model="plantCategoryToEdit"
                class="item-select"
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
                <div v-for="(plant, index) in plantCategoryToEdit.plants" :key="index" >
                    <hr />
                    <div class="d-flex flex-row gap-2">
                        <div class="up-down-arrows align-content-center text-center">
                            <button 
                                class="btn px-1 py-0"
                                v-if="index !== 0"
                                @click="arrayMove(plantCategoryToEdit.plants,index,index-1)">
                                <FontAwesome 
                                class="move-arrow" 
                                icon="caret-up" />
                            </button>
                            <button
                                v-if="index !== plantCategoryToEdit.plants.length -1"
                                class="btn px-1 py-0"
                                @click="arrayMove(plantCategoryToEdit.plants,index,index+1)" >
                                <FontAwesome  
                                class="move-arrow" 
                                icon="caret-down" />
                            </button>
                        </div>

                        <PlantItemForm :plant @triggerSave="saveCategory(plantCategoryToEdit)" @deletePlant="removePlant(index)"/>

                    </div>
                </div>
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
                :link="`/plants/${encodeURIComponent(plantCategoryToEdit.id !== '' ? plantCategoryToEdit.id : 0)}`"
                :photoUrl="getCardPhoto(plantCategoryToEdit)"
                class="product-card"
            />
        </div>
    </div>

    <PhotoUploadModal 
        v-if="plantCategoryToEdit !== undefined"
        :photos="photoModalArr" 
        :storageFolder="photoModalFolder" 
        ref="photoModal" 
        @triggerSave="saveCategory(plantCategoryToEdit)"
    />

</template>

<script setup lang="ts">
import { ref, onMounted, provide, type Ref} from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import PlantCategoryForm from '@/components/products/PlantCategoryForm.vue';
import PlantItemForm from '@/components/products/PlantItemForm.vue';
import ItemSelect from '@/components/UI/ItemSelect.vue';
import { usePlantStore } from '@/stores/plant';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'
import PhotoUploadModal from '@/components/PhotoUploadModal.vue';
import { type PhotoItem } from '@/types/Product';
import { getCardName, getDisplayPrice, getCardPhoto } from '@/composables/useCardUtils';
import { getAllPlants } from '@/apis/dataServices'

const {fetchAllCategories, findPlantCategoryById, setCategoryToEdit, saveCategory, addPlant, getAvailablePlants, removePlant} = usePlantStore()
const {plantCategories, plantCategoryToEdit, isSaving} = storeToRefs(usePlantStore())
const route = useRoute()

onMounted(async () => {
    await fetchAllCategories()
    currentAvailablePlants.value = await fetchCurrentAvailablePlants()
    //TODO: find a way to change nav to exclude :id without messy custom logic, and then change this to === undefined or null
    if(route.params.id !== ":id" && route.params.id !== undefined) {
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

function arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    if(toIndex > arr.length-1) {console.log('Unable to move in array, toIndex greater than arr.length. toIndex:' + toIndex + 'arr.length: ' + arr.length)}
    const ele = arr[fromIndex]
    arr.splice(fromIndex,1)
    arr.splice(toIndex, 0, ele)
    save()
}

const currentAvailablePlants = ref({totalAvailable: -1, heliCount: -1, heliVarieties: -1, nepCount: -1, cephCount: -1})
async function fetchCurrentAvailablePlants() {
    const allPlants = await getAllPlants()
    console.log(allPlants)
    const availablePlants = allPlants.filter((plant) => !['Hidden', 'Archived', 'Sold'].includes(plant.status) && plant.quantity !== 0)
    const heliCount = availablePlants.filter((plant) => plant.genus === 'Heliamphora').reduce((acc, obj) => {return acc + obj.quantity}, 0)
    const heliVarieties = [... new Set(availablePlants.filter((plant) => plant.genus === 'Heliamphora').map(heli => heli.plantCategoryId))]
    console.log(heliVarieties)
    const nepCount = availablePlants.filter((plant) => plant.genus === 'Nepenthes').reduce((acc, obj) => {return acc + obj.quantity}, 0)
    const cephCount = availablePlants.filter((plant) => plant.genus === 'Cephalotus').reduce((acc, obj) => {return acc + obj.quantity}, 0)
    console.log('Heli: ' + heliCount)
    console.log('Nep: ' + nepCount)
    console.log('Ceph: ' + cephCount)
    return {
        totalAvailable: availablePlants.length,
        heliCount: heliCount,
        heliVarieties: heliVarieties.length,
        nepCount: nepCount,
        cephCount: cephCount
    }
}

const photoModal = ref()
const photoModalFolder = ref('')
const photoModalArr: Ref<PhotoItem[]> = ref([])
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
    .item-select {
        max-width: 95dvw;
    }
    .product-card {
        max-height: 40rem;
    }
    .up-down-arrows {
        display: grid;
        min-width: 2.5rem;
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
