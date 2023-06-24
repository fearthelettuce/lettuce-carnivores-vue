<template>
    <div class="container">
        <ProductPhotoItem
        v-for="photo of props.product.photoData"
        :photo="photo"
        />
        <button class="btn btn-primary">Add Photo</button>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ProductPhotoItem from './ProductPhotoItem.vue';
const props = defineProps(['product'])
onMounted(() => {
    console.log(props.product.photoData)
})
</script>