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
            <button 
                type="button" 
                class="btn-close" 
                aria-label="Close"
                data-bs-dismiss="modal"
                @click="$emit('closeModal')"
            ></button>
            <div class="image-hover-container">
                <img :src="getPhotoUrl(photo?.path?.toString())" :alt="imageAltText">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import type { PropType } from 'vue';
import { Modal } from 'bootstrap'
import { onMounted } from 'vue';
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
        width: 100%;
    }
    img {
        width: 100%;
        height: 100%;
    }
    .btn-close{
        position: absolute;
        top: 0;
        right: 0;
        padding: 1em 2em;
        cursor: pointer;
    }
    .btn-close:hover{
        cursor: pointer;

    }
</style>