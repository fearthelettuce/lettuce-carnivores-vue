<template>
    <aside class="product-photo-container">
        <div class="row">
            <img class="col-12 image-preview" :src="displayPhoto" @click="showImageZoomModal">
        </div>
        <div class="photo-list row mt-2 g-4">
            <img 
            v-for="photo of props.photos" 
            :key=photo.path.toString() 
            :src="getPhotoUrl(photo.path.toString())"
            class="col-4 photo-list-item"
            @click="setSelectedPhoto(photo)">
        </div>
        <ImageZoomModal ref="imageZoomModalRef" :photo="state.selectedPhoto"/>
    </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import ImageZoomModal from '@/components/app/UI/ImageZoomModal.vue';
import type { PhotoDetails, PhotoItem,  } from '../types/product';
import {getPhotoUrl} from '@/apis/fileServices'
const placeholderUrl = 'https://cdn-icons-png.flaticon.com/512/1033/1033018.png'

const props = defineProps<{
    photos: Array<PhotoItem>,
    photoData?: PhotoDetails,
}>()

const state = reactive({
    selectedPhoto: {} as PhotoItem,
})

const displayPhoto = computed(() => {
    if(!state.selectedPhoto || !state.selectedPhoto.path ) return placeholderUrl
    return getPhotoUrl(state.selectedPhoto.path.toString())
})

const imageZoomModalRef = ref<InstanceType<typeof ImageZoomModal> | null>(null)

onMounted(() => {
    if(props.photos) {
        state.selectedPhoto = props.photos[0]
    }
})

function setSelectedPhoto(photo: PhotoItem) {
    state.selectedPhoto = photo
}

function showImageZoomModal() {
    imageZoomModalRef.value?.expandImage()
}

</script>

<style scoped>
.product-photo-container {
    width: 100%;
}
.image-preview {
    width: 100%;
    object-fit: cover;
    object-position: 0% 25%;
    cursor: pointer;
}
.placeholderImage {
    box-sizing: border-box;
    padding: 5em;
    width: 25em;
    margin: auto;
}
.photo-list-item {
    object-fit: cover;
    object-position: 0% 25%;
    height: 15em;
}

@media (min-width: 80rem) {
    .product-photo-container {
        width: 45vw;
    }
    .image-preview {
        width: 100%;
        height: 50em;
    }
}

</style>