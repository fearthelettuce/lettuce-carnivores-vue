<template>
    <section class="aligncontentcenter">
        <div v-if="props.photos.length === 0" class="textcenter textwarning"> <h3>No photos to display :(</h3></div>
        <div v-else class="photo-grid">
            <figure
                v-for="photo of props.photos"
                :key=photo.path.toString()
                @click="setSelectedPhoto(photo)"
                @mouseover="setSelectedPhoto(photo)"
                class="photo-list-item">
                <img :src="getPhotoUrl(photo.path.toString())">
            </figure>
            <figure class="selected-image" @click="showImageZoomModal"><img :src="displayPhoto"></figure>
        </div>
    </section>
    <ImageZoomModal v-if="props.photos.length !== 0 && selectedPhoto" ref="imageZoomModal" :photo="selectedPhoto"/>
</template>

<script setup lang="ts">
import { ref, type Ref, computed, onMounted, watch } from 'vue';
import ImageZoomModal from '@/components/UI/ImageZoomModal.vue';
import type { PhotoItem,  } from '@/types/Product';
import {getPhotoUrl} from '@/composables/usePhotoUtils'

const props = defineProps<{
    photos: Array<PhotoItem>,
}>()
const selectedPhoto: Ref<PhotoItem | undefined> = ref(undefined)

const displayPhoto = computed(() => {
    return getPhotoUrl(selectedPhoto.value?.path, 960)
})

const imageZoomModal = ref()
watch(() => props.photos,() => {
    if(props.photos) {
        selectedPhoto.value = props.photos[0]
    }
})
onMounted(() => {
    if(props.photos) {
        selectedPhoto.value = props.photos[0]
    }
})

function setSelectedPhoto(photo: PhotoItem) {
    selectedPhoto.value = photo
    //TODO: add transitions when setSelectedPhoto is called https://vuejs.org/guide/built-ins/transition
}

function showImageZoomModal() {
    imageZoomModal.value?.toggleModal()
}

</script>

<style scoped>
img {
    display: block;
    height: 100%;
    width: 100%;
}
figure {
    margin: 0;
}
.photo-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 15dvh;
}
.selected-image {
    grid-row: 1 / 5;
    grid-column: 1 / 4;
    order: 1;
    img{
        height: 100%;
        object-fit:cover;
        border-radius: 1rem;
    }
}
.photo-list-item {
    grid-row: span 1 / auto;
    grid-column: span 1 / auto;
    img{
        object-fit: cover;
        border-radius: 1rem;
    }
}

@media (min-width: 60rem) {
    .photo-grid {
        grid-template-columns: 2fr 5fr;
        grid-auto-rows: 28dvh;
    }
    .selected-image {
        grid-row: 1 / 4;
        grid-column: 2 / auto;
        img{
            object-fit:contain;
        }
    }
}
</style>