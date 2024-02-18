<template>
    <header class="photo-upload-header">
        <button class="btn btn-primary" @click="showModal">Add Photos</button>
    </header>
    <section v-if="product.photos && product.photos.length > 0">
        <ProductPhotoItem
            v-for="photo of product.photos"
            :photo="photo"
            :key="photo.path.toString"
            @deletePhoto="deletePhoto(photo)"
        />
    </section>
        
    <footer class="my-5"></footer>


    <PhotoUploadModal
        ref="photoUploadModal"
        storageFolder="plantPhotos"
        :photos="product.photos"
        @closeModal="state.photoUploadModal.hide()"
        @updatePhotoData="appendPhotos"
        @showToast="showToast"
    />
</template>

<script setup lang="ts">
//TODO: add way to upload reference photos using props, different methods.  
import { onMounted, reactive } from 'vue';
import { useProductStore } from '../../stores/product';
// import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification' 
import ProductPhotoItem from './ProductPhotoItem.vue';
import PhotoUploadModal from './PhotoUploadModal.vue';
import type {PhotoItem} from '@/components/modules/products/types//product'
import { Modal } from 'bootstrap';

const productStore = useProductStore()
// const { getProductToEdit: product } = storeToRefs(productStore)
const props = defineProps(['product'])
const toast = useToast()

const state = reactive({
    photoUploadModal: Modal || null,
})
onMounted(() => {
    state.photoUploadModal = new Modal('#photoUploadModal', {})
})

function showModal() {
    state.photoUploadModal = new Modal('#photoUploadModal', {})
    state.photoUploadModal.show()
}

function showToast(obj: any) {
    if(obj.type === 'success'){
        toast.success(obj.message)
    } else {
        toast.warning(obj.message)
    }
}

function appendPhotos(selectedPhotosArr:Array<PhotoItem>) {
    productStore.appendPhotoData(props.product, selectedPhotosArr)
}

function deletePhoto(photoToRemove: PhotoItem) {
    console.log(photoToRemove)
    productStore.removePhoto(props.product, photoToRemove)
}

</script>

<style scoped>
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
