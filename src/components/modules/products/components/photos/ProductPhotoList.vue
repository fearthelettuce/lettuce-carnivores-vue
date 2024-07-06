<template>
    <header class="photo-upload-header">
        <button class="btn btn-primary" @click="showModal">Add Photos</button>
    </header>
    <section v-if="product && product.photos && product.photos.length > 0">
        <ProductPhotoItem
            v-for="photo of product.photos"
            :photo="photo"
            :key="photo.path.toString"
            @deletePhoto="deletePhoto(photo)"
        />
    </section>
        
    <footer class="my-5"></footer>


    <PhotoUploadModal
        v-if="product"
        ref="photoUploadModal"
        storageFolder="plantPhotos"
        :photos="product.photos"
        @closeModal="state.photoUploadModal.hide()"
        @updatePhotoData="appendPhotos"
    />
</template>

<script setup lang="ts">
//TODO: add way to upload reference photos using props, different methods.  
import { onMounted, reactive } from 'vue';
import { useProductStore } from '../../stores/product';
// import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import ProductPhotoItem from './ProductPhotoItem.vue';
import PhotoUploadModal from './PhotoUploadModal.vue';
import type {PhotoItem} from '@/components/modules/products/types/product'
import { Modal } from 'bootstrap';

const productStore = useProductStore()
// const { getProductToEdit: product } = storeToRefs(productStore)
const props = defineProps(['product'])

const state = reactive({
    photoUploadModal: Modal || null,
})
// onMounted(() => {
//     state.photoUploadModal = new Modal('#photoUploadModal', {})
// })

function showModal() {
    state.photoUploadModal = new Modal('#photoUploadModal', {})
    state.photoUploadModal.show()
}

function appendPhotos(selectedPhotosArr:Array<PhotoItem>) {
    productStore.appendPhotoData(props.product, selectedPhotosArr)
}

async function deletePhoto(photoToRemove: PhotoItem) {
    const res = await productStore.removePhoto(props.product, photoToRemove)
    if (!res) {return}
    if(res.success) {
        toast.success(res.message)
    } else {
        toast.error(res.message)
    }
}

</script>

<style scoped>
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
