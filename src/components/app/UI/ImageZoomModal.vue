<template>
    <BaseModal 
        ref="expandImage"
        id="expandImage"
        @closeModal="state.expandImage.hide()"
    >
        <template #body>
            <div class="image-hover-container">
                <img :src="getPhotoUrl(photo?.path?.toString())" :alt="imageAltText">
            </div>
        </template>
        
    </BaseModal>
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

        width: 80dvh;
    }
    img {
        width: 100%;
        height: 100%;
    }
</style>