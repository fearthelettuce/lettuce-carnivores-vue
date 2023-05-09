<template>
    <div class="container py-3">
        <div class="mb-3">
            <label for="formFile" class="form-label">Select Photos</label>
            <input class="form-control" type="file" id="formFile" @change="onFileChanged($event)" accept="image/*" multiple>
        </div>
        <div class="d-flex flex-column">
            <div v-if="photoData.length > 0" v-for="photo of photoData" >
                <img :src="photo.tempUrl" class="imagePreview"/>
                <label for="imageType">{{photo.file.name}}</label><input id="imageType" type="text" v-model="photo.type"/>
            </div>
            <button @click="uploadImages">Upload Images</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ProductImages } from '@/components/modules/products/types/product';
import { NepenthesImages } from '@/components/modules/products/types/plants';
import { uploadFile } from '@/apis/fileServices';

const files = ref<FileList | null>();
const form = ref<HTMLFormElement>();
let photoData = reactive([])
const imageData = reactive({
    isReference: false,
    imageData: {
        name: null,
        cardImageUrl: null,
        primaryProductImageUrl: null,
        additionalProductImageUrls: [],
        upperPitcherImageUrl: null,
        lowerPitcherImageUrl: null
    }

})

function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i: number = 0; i < target.files.length; i++) {
            photoData.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i])
            })
        }
    }

    console.log(photoData[0].file)
    
}

function uploadImages() {
    console.log(photoData)
    uploadFile(photoData[0].name,'plantPhotos',photoData[0].file)
}
</script>

<style>

.imagePreview {
    width: 10em;
    height: 10em;
}

input[type=file]::-webkit-file-upload-button {
    background-color: rgb(159, 219, 80);
    color: #383838;
}

</style>