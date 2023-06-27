<template>
    <div v-if="props.photo.file || props.photo[Object.keys(photo)[0]]?.fullPath" class="row my-3">
        <div class="col-3 imagePreviewContainer">
            <img :src="props.photo.tempUrl ? props.photo.tempUrl : props.photo[Object.keys(photo)[0]]?.fullPath ? props.photo[Object.keys(photo)[0]].fullPath : ''"
                class="imagePreview" />
        </div>
        <div class="col-3 d-flex justify-content-center align-items-center">
            <label
                for="imageType">{{ props.photo?.file ? props.photo.file.name : props.photo[Object.keys(photo)[0]] ? props.photo[Object.keys(photo)[0]].name : '' }}</label>
        </div>
        <div class="col-1 form-check form-switch d-flex justify-content-center align-items-center">
            <input id="isReferencePhoto" type="checkbox" class="form-check-input text-primary "
                v-model="props.photo.isReferencePhoto" />
        </div>
        <div class="col-2 mx-2 d-flex justify-content-center align-items-center">
            <select name="genus" class="form-select" aria-label="Select Genus" v-model="props.photo.photoType">
                <option id="placeholder" disabled value="">Select Photo Type</option>
                <option v-for="item of photoTypes" :value="item.id">{{ item.label }}</option>
            </select>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
            <div class="btn" @click="$emit('removePhoto', photo)">
                <fa icon="dumpster-fire" size="lg" style="color: #f29c07;" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { useProductStore } from '@/components/modules/products/stores/product';
import { emit } from 'process';

const productStore = useProductStore()
const photoData = reactive([])
const props = defineProps(['photo'])

onMounted(() => {
    console.log(props.photo)
    console.log(props.photo.file)
})

const photo = computed(() => {
    
})
const photoTypes = [
    { id: 'primary', label: 'Primary' },
    { id: 'card', label: 'Card' },
    { id: 'additional', label: 'Additional' },
    { id: 'upper', label: 'Upper' },
    { id: 'lower', label: 'Lower' }
]

</script>

<style>
.imagePreviewContainer {
    height: 8em;
    overflow: hidden;
}

.imagePreview {
    height: 10em;
}


input[type=file]::-webkit-file-upload-button {
    background-color: rgb(159, 219, 80);
    color: #383838;
}
</style>

//TODO: Add click to enlarge on images
//TODO: Separate functionality for adding images and new images