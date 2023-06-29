<template>
    <div class="row my-4">
        <div class="col-4 centered"><img class="" :src="photoUrl" /></div>
        <div class="col-2 centered">{{ props.photo.name ? props.photo.name : '' }}</div>
        <div class="col-1 centered">{{ props.photo.type ? props.photo.type : '' }}</div>
        <div class="col-4 centered">{{ props.photo.path ? props.photo.path : '' }}</div>
        <div class="col-1 centered">
            <div class="btn " @click="deletePhoto(props.photo.path)">
                <FontAwesome icon="dumpster-fire" size="lg" style="color: #f29c07;" />
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

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>