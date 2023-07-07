<template>
    <div>
        <div>
            <img class="image-preview" :src="displayPhoto">
        </div>
        <div class="photo-list">
            <img 
            v-for="photo of props.photos" 
            :key=photo.path.toString() 
            :src="getPhotoUrl(photo.path.toString())"
            class="photo-list-item"
            @click="setSelectedPhoto(photo)">
        </div>
    </div>
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
.image-preview {
    width: 20em;
}
.photo-list-item {
    width: 10em;
}
</style>