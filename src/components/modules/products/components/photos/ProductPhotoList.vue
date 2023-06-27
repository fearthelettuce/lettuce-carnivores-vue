<template>
    <div class="container">
        <button class="btn btn-primary" @click="state.photoUploadModal.show()">Add Photo</button>
        <ProductPhotoItem
        v-if="product.photos && product.photos.length > 0"
        v-for="photo of product.photos"
        :photo="photo"
        />
    </div>

    <PhotoUploadModal
        ref="photoUploadModal"
        storageFolder="plantPhotos"
        @closeModal="state.photoUploadModal.hide()"
        @updatePhotoData="appendPhotos"
        @showToast="showToast"
    />
</template>

<script setup lang="ts">
//TODO: add way to upload reference photos using props, different methods.  
import { onMounted, reactive } from 'vue';
import { useProductStore } from '../../stores/product';
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification' 
import ProductPhotoItem from './ProductPhotoItem.vue';
import PhotoUploadModal from './PhotoUploadModal.vue';
import type {PhotoItem} from '@/components/modules/products/types//product'
import { Modal } from 'bootstrap';

const productStore = useProductStore()
const { getProductToEdit: product } = storeToRefs(productStore)

const toast = useToast()

const state = reactive({
    photoUploadModal: Modal || null,
})
onMounted(() => {
    state.photoUploadModal = new Modal('#photoUploadModal', {})
})

function showToast(obj: any) {
    if(obj.type === 'success'){
        toast.success(obj.message)
    } else {
        toast.warning(obj.message)
    }
}

function appendPhotos(arr:Array<PhotoItem>) {
    productStore.updatePhotoData(product.value, arr)
}

</script>

<style scoped>

</style>
