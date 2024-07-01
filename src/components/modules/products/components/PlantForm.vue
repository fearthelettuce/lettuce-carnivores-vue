<template>
    <form @submit.prevent>
        <FormKit 
            type="text"
            label="Name"
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
        />
        <FormKit 
            type="text"
            label="ID"
            number
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

</style>