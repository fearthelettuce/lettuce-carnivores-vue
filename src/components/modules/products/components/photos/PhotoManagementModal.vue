<template>
    <BaseDialog :open="open">
        <ProductPhotoList />
    </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseDialog from '@/components/app/UI/BaseDialog.vue';
import ProductPhotoList from './ProductPhotoList.vue';

const props = defineProps<{
    data: Object,
}>()
defineExpose({toggleModal})
const open = ref(false)

function toggleModal() {
    open.value = !open.value;
}
</script>
