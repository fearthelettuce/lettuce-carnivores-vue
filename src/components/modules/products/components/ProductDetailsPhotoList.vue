<template>
    <section class="photo-grid">
        <figure
            v-for="photo of props.photos"
            :key=photo.path.toString()
            @click="setSelectedPhoto(photo)"
            @mouseover="setSelectedPhoto(photo)"
            class="photo-list-item">
            <img :src="getPhotoUrl(photo.path.toString())">
        </figure>
        <figure class="selected-image" @click="showImageZoomModal"><img :src="displayPhoto"></figure>
    </section>
    <ImageZoomModal ref="imageZoomModalRef" :photo="state.selectedPhoto"/>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import ImageZoomModal from '@/components/app/UI/ImageZoomModal.vue';
import type { PhotoItem,  } from '../types/product';
import {getPhotoUrl} from '@/composables/usePhotoUtils'

const props = defineProps<{
    photos: Array<PhotoItem>,
}>()

const state = reactive({
    selectedPhoto: {} as PhotoItem,
})

const displayPhoto = computed(() => {
    return getPhotoUrl(state.selectedPhoto.path)
})

const imageZoomModalRef = ref<InstanceType<typeof ImageZoomModal> | null>(null)

onMounted(() => {
    if(props.photos) {
        state.selectedPhoto = props.photos[0]
    }
})

function setSelectedPhoto(photo: PhotoItem) {
    state.selectedPhoto = photo
    //TODO: add transitions when setSelectedPhoto is called https://vuejs.org/guide/built-ins/transition
}

function showImageZoomModal() {
    imageZoomModalRef.value?.expandImage()
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
        grid-auto-rows: 29dvh;
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