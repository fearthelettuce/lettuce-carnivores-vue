<template>
    <form @submit.prevent class="plant-admin-form">
        <FormKit 
            type="text"
            label="ID"
            number
            v-model="plantFormInput.id"
        />
        <FormKit 
            type="text"
            label="Name"
            outer-class="grid-col-2"
            v-model="plantFormInput.name" 
        />
        <FormKit 
            type="text"
            label="Genus"
            v-model="plantFormInput.genus" 
        />
        <FormKit
            type="text"
            label="Clone"
            v-model="plantFormInput.clone" 
        />
        <FormKit
            type="text"
            label="Status"
            v-model="plantFormInput.status" 
        />
        <FormKit
            type="textarea"
            label="Description"
            outer-class="grid-col-5"
            v-model="plantFormInput.description" 
        />
        
        <button class="btn btn-primary" @click.prevent="savePlant">Save Plant</button>
    </form>
    
    <!-- <div>
        <ProductPhotoList />
    </div> -->

</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type PlantCategory } from '@/types/Plant'
import ProductPhotoList from './photos/ProductPhotoList.vue';
import { usePlantStore } from '../stores/plant';

const store = usePlantStore()

type PlantFormInput = {
    id: number | undefined,
    name: string,
    genus: string,
    clone: string,
    description: string,
    status: string,
}

const plantFormInput: Ref<PlantFormInput> = ref({
    id: undefined,
    name: '',
    genus: '',
    clone: '',
    description: '',
    status: '',
    
})

// const { plantCategory } = defineProps<PlantCategory>()

//Name
//Genus
//Clone
//Description
//Photos

async function savePlant() {
    console.log(plantFormInput.value)
    await store.saveCategory(plantFormInput.value)
}

</script>

<style scoped>

.plant-admin-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    margin-bottom: 2rem;
    gap: 0 2em;
}

</style>