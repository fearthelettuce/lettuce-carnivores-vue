<template>
    <form @submit.prevent class="plant-admin-form">
        <FormKit 
            type="text"
            label="ID"
            number
        />
        <FormKit 
            type="text"
            label="Name"
            outer-class="grid-col-3"
            :value="plantFormInput.name" 
        />
        <FormKit 
            type="text"
            label="Genus"
        />
        <FormKit
            type="text"
            label="Clone"
        />
        <FormKit
            type="textarea"
            label="Description"
            outer-class="grid-col-5"
        />
        

    </form>
    
    <!-- <div>
        <ProductPhotoList />
    </div> -->

</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type PlantCategory } from '@/types/Plant'
import ProductPhotoList from './photos/ProductPhotoList.vue';

type PlantFormInput = {
    name: string,
    genus: string,
    clone: string,
    description: string,
    id: number | undefined
}

const plantFormInput: Ref<PlantFormInput> = ref({
    name: '',
    genus: '',
    clone: '',
    description: '',
    id: undefined
})

const { plantCategory } = defineProps<PlantCategory>()

//Name
//Genus
//Clone
//Description
//Photos

</script>

<style scoped>

.plant-admin-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    margin-bottom: 2rem;
    gap: 0 2em;
}

</style>