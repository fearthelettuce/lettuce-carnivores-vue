<template>
    <BaseDialog :open class="image-zoom-modal">
        <div class="image-container">
            <div class="image-hover-container">
                <img :src="getPhotoUrl(photo?.path?.toString(), 1600)" @click="toggleModal" :alt="imageAltText">
            </div>
        </div>
    </BaseDialog>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import type { PhotoItem } from '@/types/Product';
import {getPhotoUrl} from '@/composables/usePhotoUtils'

const props = defineProps({
    photo: {
        type: Object as PropType<PhotoItem>,
        required: true,
    },
})

const open = ref(false)
defineExpose({toggleModal})
function toggleModal() {
    open.value = !open.value;

}

const imageAltText = computed(()=>{
    return `An image of ${props.photo.name}`
})

</script>

<style scoped>
    img {
        object-fit: cover;
        width: 100%;
        max-height: 90dvh;
    }
</style>