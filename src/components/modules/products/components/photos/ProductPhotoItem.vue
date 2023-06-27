<template>
    <div class="row">
        <div class="col-2">{{ props.photo.name ? props.photo.name : '' }}</div>
        <div class="col-2">{{ props.photo.type ? props.photo.type : '' }}</div>
        <img :src="photoUrl" />
        <div class="col-2">{{ props.photo.path ? props.photo.path : '' }}</div>
        <div class="col-2">{{ props.photo.originalFilename ? props.photo.originalFilename : '' }}</div>
        <div class="col-1 d-flex align-items-center justify-content-center">
            <div class="btn " @click="deletePhoto(props.photo.path)">
                <fa icon="dumpster-fire" size="lg" style="color: #f29c07;" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {getPhotoUrl} from '@/apis/fileServices'

const props = defineProps(['photo'])
const emit = defineEmits(['deletePhoto'])
const photoUrl = computed(() => {
    return getPhotoUrl(props.photo.path)
})

function deletePhoto(path: string | URL) {
    emit('deletePhoto', path)
}

</script>

<style scoped>

img{
    width: 20em;
}
</style>