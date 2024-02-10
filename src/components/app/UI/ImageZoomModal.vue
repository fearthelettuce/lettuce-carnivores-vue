<template>
    <div
        ref="expandImage"
        id="expandImage"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true"
    >
        <div   
            class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-centered"
            @closeModal="state.expandImage.hide()"
        >
            <div class="image-container">
                <div class="image-hover-container">
                    <button 
                        type="button" 
                        class="btn-close btn btn-lg" 
                        aria-label="Close"
                        data-bs-dismiss="modal"
                        @click="$emit('closeModal')" />
                    <img :src="getPhotoUrl(photo?.path?.toString())" :alt="imageAltText">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { Modal } from 'bootstrap'
import type { PhotoItem } from '@/components/modules/products/types/product';
import {getPhotoUrl} from '@/apis/fileServices'

const state = reactive({
    expandImage: Modal || null,
})

const props = defineProps({
    photo: {
        type: Object as PropType<PhotoItem>,
        required: true,
    },
})

defineExpose({
    expandImage,
})

const imageAltText = computed(()=>{
    return `An iamge of ${props.photo.name}`
})

onMounted(()=>{
    state.expandImage = new Modal('#expandImage', {})
})

function expandImage() {
    state.expandImage.show()
}

</script>

<style scoped>
    .image-hover-container {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 90dvh;
    }
    .image-container {
        position:relative;
    }
    img {
        max-height: 100%;
        object-fit: contain;
        width: 100%;
    }
    .btn-close{
        position: absolute;
        top: 0;
        right: 0;
        margin: 0.5em 0.5em;
        cursor: pointer;
    }
    .btn-close:hover{
        cursor: pointer;

    }
</style>