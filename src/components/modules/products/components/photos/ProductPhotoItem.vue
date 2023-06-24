<template>
    <div class="row">
        <div class="col-2">{{ props.photo.name ? props.photo.name : '' }}</div>
        <div class="col-2">{{ props.photo.type ? props.photo.type : '' }}</div>
        <div class="col-2">{{ props.photo.path ? props.photo.path : '' }}</div>
        <div class="col-2">{{ props.photo.isUploaded ? props.photo.isUploaded : '' }}</div>
        <div class="col-2">{{ props.photo.originalFilename ? props.photo.originalFilename : '' }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps(['photo'])
onMounted(() => {
    console.log(props.photo)
})
</script>