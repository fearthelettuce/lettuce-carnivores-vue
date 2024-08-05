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
                    <CloseButton 
                        data-bs-dismiss="modal"
                        @click="$emit('closeModal')"
                    />
                    <img :src="getPhotoUrl(photo?.path?.toString(), 1600)" :alt="imageAltText">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { Modal } from 'bootstrap'
import type { PhotoItem } from '@/types/Product';
import {getPhotoUrl} from '@/composables/usePhotoUtils'
import CloseButton from './CloseButton.vue'

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
    }
    .image-container {
        position: relative;
        margin: 0 1rem;
    }
    img {
        max-height: 100%;
        object-fit: cover;
        width: 100%;
    }
</style>