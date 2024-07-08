<template>
    <BaseContainer>
        <section v-if="plantCategory" class="d-flex productDetailSection" >
        <ProductDetailsPhotoList :photos="photosToDisplay" />
            <article class="product-information d-flex align-content-center flex-column">
                <div class="d-flex justify-content-center">
                    <h1 class="text-center">{{ plantCategory.name }}</h1>   
                </div>
                <div v-if="plantCategory.clone !== ''" class="d-flex flex-row justify-content-around">
                    <span>Clone {{ plantCategory.clone }}</span>  
                </div>
                <div>
                    <p class="text-center my-5">{{ plantCategory.description }}</p>   
                </div>
                
                <!-- <div class="size-select d-flex flex-row justify-content-evenly p-1 my-2 mx-4 rounded">
                    <button v-for="size in categorySizes" class="btn btn-dark text-body px-4">{{ size }}</button>
                    <button v-for="plant in referencePlants" class="btn btn-dark text-body px-4">{{ plant.size }}</button>
                </div> -->
                <div>Selected: {{ selectedPlant?.sku }}</div>
                <div>{{ selectedPlant?.size }}</div>
                <div v-if="referencePlants.length !== 0">
                    <h4>Represenative Plants<span ppopovertarget="representativePopover">About</span></h4>
                    <div id="representativePopover" popover><p>These plants are representative of the plants you will receive. Representative plants are generally cheaper than specimens.</p></div>

                    <div class="d-flex justify-content-evenly">
                        <button 
                            v-for="plant in referencePlants"
                            :key="plant.size" 
                            class="btn px-4"
                            :class="selectedPlant?.sku == plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                            @click="setSelectedPlant(plant)"
                        >{{plant.size}}</button>
                    </div>
                </div>
                <div v-if="specimenPlants.length !== 0" >
                    <h4>Specimen Plants<button popovertarget="specimenPopover">About</button></h4>
                    <div id="specimenPopover" popover><p>Photos of specimen plants are of the exact plant you will receive. Please be aware that old/dying pitchers may be trimmed before shipping, especially to ensure safe packaging.</p></div>
                    <div class="d-flex justify-content-evenly">
                        <button 
                            v-for="plant in specimenPlants" 
                            :key="plant.id"
                            class="btn px-4"
                            :class="selectedPlant?.sku === plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                            @click="setSelectedPlant(plant)"
                        >{{`Specimen ${plant.id}`}}</button>
                    </div>

                </div>

                <div class="d-flex flex-row justify-content-evenly mt-3">
                    <div class="align-content-center">
                        <h5 class="m-0">${{ formattedPrice }}</h5>
                    </div>
                    <button 
                        v-if="availableForSale" 
                        class="btn btn-primary"
                        @click="addToCart">
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
import type {Product} from '@/components/modules/products/types/product'
import ProductDetailsPhotoList from './ProductDetailsPhotoList.vue'
import ProductDetailsForm from './ProductDetailsForm.vue'
import type { PlantCategory, Plant} from '@/types/Plant'
import { storeToRefs } from 'pinia'

const route = useRoute()
const plantCategory: Ref<PlantCategory | undefined> = ref()

const { findPlantCategoryById, getAvailablePlants} = usePlantStore()
const {isLoading} = storeToRefs(usePlantStore())

onMounted(() => {
    fetchData()
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

// const categorySizes = computed(() => {
//     if(plantCategory.value === undefined) { return []}
//     const arr = plantCategory.value.plants
//     let unique = arr.reduce(function (acc:string[], curr: Plant) {
//         if (!acc.includes(curr.size))
//             acc.push(curr.size);
//         return acc;
//     }, []);
//     return unique.sort();
// })

const referencePlants = computed(() => {
    return getAvailablePlants(plantCategory.value).filter(plant => plant.isRepresentative).sort(function(a, b) {
        const textA = a.size.toUpperCase();
        const textB = b.size.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
})

const specimenPlants = computed(() => {
    return getAvailablePlants(plantCategory.value).filter(plant => !plant.isRepresentative).sort(function(a, b) {
        const textA = a.id
        const textB = b.id
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
})


const formattedPrice = computed(() => {
    // if(!plantCategory.value.price) return '-'
    // if(state.product.price == 0 || state.product.price < 0 || !state.product.price ) return '-'
    // const formatter = new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD',
    // })
    // return formatter.format(state.product.price)
    return selectedPlant?.value?.price
})

const availableForSale = computed(() => {
    return specimenPlants.value.length > 0 || referencePlants.value.length > 0
})

function addToCart() {
    alert('This feature is still growing, please check back in a few days!')
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

    .size-select {
        filter: brightness(110%);
    }

    .selected {

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
