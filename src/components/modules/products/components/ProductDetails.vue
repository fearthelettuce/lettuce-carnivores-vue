<template>
    <BaseContainer>
        <section v-if="plantCategory" class="d-flex productDetailSection" >
        <ProductDetailsPhotoList :photos="photosToDisplay" />
            <article class="product-information d-flex align-content-center flex-column">
                <div class="d-flex justify-content-center">
                    <h1 class="text-center">{{ plantCategory.name }}</h1>   
                </div>
                <div v-if="plantCategory.clone !== ''" class="d-flex flex-row justify-content-around">
                    <h3>Clone {{ plantCategory.clone }}</h3>  
                </div>
                <div>
                    <p class="text-center my-4">{{ plantCategory.description }}</p>   
                </div>
                <div class="mt-2">
                    <div v-if="referencePlants.length !== 0">
                        <h4 class="mb-3">Represenative Plants</h4>
    
                        <div class="d-flex justify-content-evenly">
                            <button 
                                v-for="plant in referencePlants"
                                :key="plant.size" 
                                class="btn px-4"
                                :class="selectedPlant?.sku == plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                                @click="setSelectedPlant(plant)"
                            >{{plant.size}}</button>
                        </div>
                        <div class="mt-4">
                            <small>Photos are representative of the plants you will receive. Representative plants are generally cheaper than specimens due to streamlined inventory management.</small>
                        </div>
                    </div>
                    <div v-if="specimenPlants.length !== 0" class="mt-5">
                        <h4 class="mb-3">Specimen Plants</h4>
                        
                        <div class="d-flex justify-content-evenly">
                            <button 
                                v-for="plant in specimenPlants" 
                                :key="plant.id"
                                class="btn px-4"
                                :class="selectedPlant?.sku === plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                                @click="setSelectedPlant(plant)"
                            >{{`#${plant.id} - ${plant.size}`}}</button>
                        </div>
                        <div class="mt-4">
                            <small>Photos of specimen plants show the exact plant for sale. Old/dying pitchers may be trimmed before shipping to ensure safe packaging.</small>
                        </div>
    
                    </div>
                </div>
                <hr />
                <div class="d-flex flex-row justify-content-evenly mt-2">
                    <div class="align-content-center">
                        <h5 class="m-0">{{ formattedPrice }}</h5>
                    </div>
                    <button 
                        v-if="availableForSale" 
                        class="btn btn-primary"
                        @click="addToCart"
                        :disabled="selectedPlant === undefined">
                        Add to Cart
                    </button>
                    <button 
                        v-else
                        class="btn btn-secondary"
                        disabled>
                        Out of Stock
                    </button>
                </div>       

            </article>
        </section>
        <section v-else>
            <BaseSpinner />
        </section>
    </BaseContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlantStore } from '../stores/plant'
import ProductDetailsPhotoList from './ProductDetailsPhotoList.vue'
import type { PlantCategory, Plant} from '@/types/Plant'
import { storeToRefs } from 'pinia'

const route = useRoute()
const plantCategory: Ref<PlantCategory | undefined> = ref()

const { findPlantCategoryById, getAvailablePlants} = usePlantStore()
const {isLoading} = storeToRefs(usePlantStore())

onMounted(async () => {
    await fetchData()
    const availablePlants = getAvailablePlants(plantCategory.value)
    console.log(availablePlants[0])
    if(availablePlants.length === 1) {
        setSelectedPlant(availablePlants[0])
    }
})

async function fetchData() {
    const productData = await findPlantCategoryById(Number(route.params.id))
    if(productData && productData !== undefined) {
        plantCategory.value = productData
    }
}

const selectedPlant: Ref<Plant | undefined> = ref()


function setSelectedPlant(plant: Plant | undefined) {
    if(plant === undefined || plant.sku === selectedPlant.value?.sku) {
        selectedPlant.value = undefined
        return
    } else {
        selectedPlant.value = plant
    }
}

const photosToDisplay = computed(() => {
    if(plantCategory.value !== undefined && selectedPlant.value === undefined) {
        if(plantCategory.value.photos.length > 0) {
            return plantCategory.value.photos
        } else if (plantCategory.value.plants.length > 0 && plantCategory.value.plants[0].photos.length > 0) {
            return plantCategory.value.plants[0].photos
        }
    }
    if(selectedPlant.value !== undefined && selectedPlant.value.photos.length > 0) {
        return selectedPlant.value.photos
    }
    return []
})

const referencePlants = computed(() => {
    return getAvailablePlants(plantCategory.value).filter(plant => plant.isRepresentative).sort(function(a, b) {
        const textA = a.size.toUpperCase();
        const textB = b.size.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
})

const specimenPlants = computed(() => {
    console.log(getAvailablePlants(plantCategory.value))
    return getAvailablePlants(plantCategory.value).filter(plant => !plant.isRepresentative).sort(function(a, b) {
        const textA = a.id
        const textB = b.id
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
})


const formattedPrice = computed(() => {
    if(!selectedPlant.value || selectedPlant.value.price === 0 || !selectedPlant.value.price) { return '-'}
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })
    return formatter.format(selectedPlant.value.price)

})

const availableForSale = computed(() => {
    return specimenPlants.value.length > 0 || referencePlants.value.length > 0
})

function addToCart() {
    alert('The shopping cart is still under construction.  Please meassge @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.')
}
</script>

<style scoped>
    .productDetailSection {
        flex-direction: column;
        justify-content: space-around;
    }
    .product-information {
        margin: 0 1rem;
    }

    @media (min-width: 80rem) {
    .productDetailSection {
        flex-direction: row;
    }
    .product-information {
        width: 30vw;
    }
}
</style>
