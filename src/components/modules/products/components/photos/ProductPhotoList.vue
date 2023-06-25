<template>
    <div class="container">
        <ProductPhotoItem
        v-for="photo of props.product.photos"
        :photo="photo"
        />
        <button class="btn btn-primary" @click="state.photoUploadModal.show()">Add Photo</button>

    </div>

    <PhotoUploadModal
        ref="photoUploadModal"
        @closeModal="state.photoUploadModal.hide()"
    />
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import ProductPhotoItem from './ProductPhotoItem.vue';
import PhotoUploadModal from './PhotoUploadModal.vue';
import { Modal } from 'bootstrap';

const props = defineProps(['product'])
const state = reactive({
    photoUploadModal: Modal || null,
})
onMounted(() => {
    state.photoUploadModal = new Modal('#photoUploadModal', {})
    console.log(props.product.photoData)
})
</script>