<template>
    <div>
        <FormKit 
        type="text"
        label="Name"    
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

    </div>
    
    <div>
        <ProductPhotoList />
    </div>

</template>

<script setup lang="ts">
import ProductPhotoList from './photos/ProductPhotoList.vue';

//Name
//Genus
//Clone
//Description
//Photos

</script>

<style scoped>

</style>