<template>
    <BaseContainer>
        <section v-if="plantCategory" class="d-flex product-detail-section" >
        <ProductDetailsPhotoList :photos="photosToDisplay" />
            <article class="product-information d-flex align-content-center flex-column">
                <div class="d-flex justify-content-center">
                    <h1 class="text-center">{{ plantCategory.name }}</h1>   
                </div>
                <div v-if="plantCategory.clone !== ''" class="d-flex flex-row justify-content-around">
                    <h3>Clone {{ plantCategory.clone }}</h3>  
                </div>

                <div>
                    <p class="text-center my-4" :class="hideDescription ? '' : 'description-one-line'" @click="toggleHideDescription">{{ plantCategory.description }}</p>   
                </div>

                <div class="d-flex justify-content-evenly">
                    <button 
                        v-for="plant in referencePlants"
                        :key="plant.size" 
                        class="btn px-4"
                        :class="selectedPlant?.sku == plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                        @click="setSelectedPlant(plant)"
                    >{{plant.size}}</button>
                </div>
                <div class="d-flex justify-content-evenly mt-3 flex-wrap">
                    <button 
                        v-for="plant in specimenPlants" 
                        :key="plant.id"
                        class="btn px-4 specimen-button"
                        :class="selectedPlant?.sku === plant.sku ? 'btn-primary' : 'btn-outline-secondary text-body'"
                        @click="setSelectedPlant(plant)"
                    >{{`Specimen ${plant.id} - ${plant.size}`}}</button>
                </div>
                
                <div v-if="selectedPlant !== undefined" class="mt-4">
                    <h5 class="mb-3">{{plantTypeLabel}}</h5>
                    <small>{{ plantTypeDescription }}</small>
                </div>
                <hr class="my-4" />
                <div class="d-flex flex-row justify-content-evenly">
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
import { useOrderStore } from '../stores/cart'
import ProductDetailsPhotoList from './ProductDetailsPhotoList.vue'
import { toast } from 'vue3-toastify'
import type { PlantCategory, Plant} from '@/types/Plant'

const route = useRoute()
const plantCategory: Ref<PlantCategory | undefined> = ref()
const { addItemToCart } = useOrderStore()

const { findPlantCategoryById, getAvailablePlants} = usePlantStore()

onMounted(async () => {
    await fetchData()
    const availablePlants = getAvailablePlants(plantCategory.value)
    if(availablePlants.length === 1) {
        setSelectedPlant(availablePlants[0])
    }
})

const hideDescription = ref(false)

function toggleHideDescription () {
    hideDescription.value = !hideDescription.value
}

const plantTypeLabel = computed(() => {
    if (selectedPlant.value === undefined) { return '' }
    return selectedPlant.value.isRepresentative ? 'Representative Plant' : 'Specimen Plant'
})

const plantTypeDescription = computed(() => {
    if (selectedPlant.value === undefined) { return '' }
    return selectedPlant.value.isRepresentative ? 'The photos for this plant show a plant that is similar to the plant that you will receive. Representative plants are generally less expensive due to streamlined inventory management..'
     : 'The photos for this plant show the exact plant for sale. Note that old/dying pitchers may be trimmed before shipping to ensure safe packaging.'
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

async function addToCart() {
    if(selectedPlant && selectedPlant.value && plantCategory && plantCategory.value) {
        const res = await addItemToCart({
        sku: selectedPlant.value.sku,
        price: selectedPlant.value.price,
        quantity: 1, 
        categoryId: plantCategory.value.id})

        if(res && res.success === true) {
            toast.success('Added to cart!')
        } else {
            if(res && res.errorMessage) {
                toast.error(res.errorMessage)
            } else {
                toast.error('Unable to add to cart')
            }
        }
    }
   
    //alert('The shopping cart is still under construction.  Please message @dangerlettuce on Instagram, Facebook, or eBay to purchase any of the plants listed here.')
}
</script>

<style scoped>
    .product-detail-section {
        flex-direction: column;
        justify-content: space-around;
        margin: 0 2rem 2rem;
    }
    .product-information {
        margin: 0 1rem;
    }

    .specimen-button {
        flex-basis: 100%;
    }

    .description-one-line {
        height: 1.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    @media (min-width: 30rem) {
        .specimen-button {
            flex-basis: auto;
        }
    }

    @media (min-width: 80rem) {
    .product-detail-section {
        flex-direction: row;
        margin: 0 5dvw 1rem;
    }
    .product-information {
        max-width: 30rem;
        margin-left: 2rem;
    }

        .specimen-button {
            flex: 1 1 auto;
        }
}
</style>
