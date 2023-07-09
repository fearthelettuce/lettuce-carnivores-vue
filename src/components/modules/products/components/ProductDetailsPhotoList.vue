<template>
    <aside class="product-photo-container">
        <div class="row">
            <img class="col-12 image-preview" :src="displayPhoto">
        </div>
        <div class="photo-list row mt-2 g-4">
            <img 
            v-for="photo of props.photos" 
            :key=photo.path.toString() 
            :src="getPhotoUrl(photo.path.toString())"
            class="col-4 photo-list-item"
            @click="setSelectedPhoto(photo)">
        </div>
    </aside>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import type { PhotoDetails, PhotoItem,  } from '../types/product';
import {getPhotoUrl} from '@/apis/fileServices'
const placeholderUrl = 'https://cdn-icons-png.flaticon.com/512/1033/1033018.png'

const state = reactive({
    selectedPhoto: null as null | PhotoItem,
})

const displayPhoto = computed(() => {
    if(!state.selectedPhoto ) return placeholderUrl
    return getPhotoUrl(state.selectedPhoto.path.toString())
})

const props = defineProps<{
    photos: Array<PhotoItem>,
    photoData?: PhotoDetails,
}>()

onMounted(() => {
    if(props.photos) {
        state.selectedPhoto = props.photos[0]
    }
})

function setSelectedPhoto(photo: PhotoItem) {
    state.selectedPhoto = photo
}

</script>

<style>
.product-photo-container {
    width: 90vw;
}
.image-preview {
    width: 20em;
    height: 35em;
    display: block;
    object-fit: cover;
}
.placeholderImage {
    box-sizing: border-box;
    padding: 5em;
    width: 25em;
    margin: auto;
}
.photo-list-item {
    object-fit: cover;
    height: 10em;
}

@media (min-width: 80rem) {
    .product-photo-container {
        width: 45vw;
    }
    .image-preview {
        width: 35em;
        height: 50em;
    }
}

</style>