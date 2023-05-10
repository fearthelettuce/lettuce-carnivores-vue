<template>
    <div class="container py-3">
        <div class="row mb-3">
            <div class="col-3">
                <input class="form-control" type="file" id="formFile" @change="onFileChanged($event)" accept="image/*" multiple>
            </div>
            <div class="col-3 d-flex justify-content-center">
                <h5>Filename</h5>
            </div>
            <div class="col-1 d-flex justify-content-center">
                <h5>Reference?</h5>
            </div>
            <div class="col-2 mx-2 d-flex justify-content-center">
                <h5>Photo Type</h5>
            </div>
            <div class="col-2 d-flex justify-content-center">
                <h5>Delete</h5>
            </div>
        </div>

        <div v-if="photoData.length > 0" v-for="(photo, index) of photoData" class="row my-3">
            <div class="col-3 imagePreviewContainer">
                <img :src="photo.tempUrl" class="imagePreview"/>
            </div>
            <div class="col-3 d-flex justify-content-center align-items-center">
                <label for="imageType">{{photo.file.name}}</label>
            </div>
            <div class="col-1 form-check form-switch d-flex justify-content-center align-items-center">
                <input id="isReferencePhoto" type="checkbox" class="form-check-input text-primary " v-model="photo.isReferencePhoto" />
            </div>
            <div class="col-2 mx-2 d-flex justify-content-center align-items-center">
                <select name="genus" class="form-select" aria-label="Select Genus" v-model="photo.photoType">
                    <option id="placeholder" selected disabled value="">Select Photo Type</option>
                    <option v-for="item of photoTypes" :value="item.label">{{ item.label }}</option>
                </select>
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <div class="btn" @click="removePhoto(index)"><fa icon="dumpster-fire" size="lg" style="color: #f29c07;" /></div>
            </div>
        </div>
        <div>
            <div class="row justify-content-around d-flex flex-row mt-4">
                <button type="button" class="col-2 btn btn-primary mx-4" @click="uploadImages">Upload Images</button>
            </div>
        </div>
    </div>
    <div class="toast-container position-absolute p-5 top-0 end-0">
            <BaseToast
            ref="successMessageToast"
            id="successMessageToast"
            type="success"
            >
                <template #toastBody>{{ state.successMessage }}</template>
            </BaseToast>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Toast } from 'bootstrap'
import { ProductImages } from '@/components/modules/products/types/product';
import { NepenthesImages } from '@/components/modules/products/types/plants';
import { uploadFile } from '@/apis/fileServices';

const files = ref<FileList | null>();
const form = ref<HTMLFormElement>();
let photoData = reactive([])
const props = defineProps(['plantId', 'plantName'])
const state = reactive({
    successMessageToast: null,
    successMessage: null,
})

onMounted(() => {
    state.successMessageToast = new Toast('#successMessageToast')
})
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
const photoTypes = [
        { id: 1, label: 'Primary' },
        { id: 2, label: 'Card' },
        { id: 3, label: 'Additional' },
        { id: 4, label: 'Upper' },
        { id: 5, label: 'Lower' }
    ]
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
function getPhotoName(photo, index) {
    //TODO: add better logic to handle duplicate types
    const fileExtension = photo.file.name.split('.').pop()
    return `${props.plantName} - ${photo.photoType} - ${index}.${fileExtension}`
}
async function uploadImages() {
    let fileUploadCounter = 0
    for (let i = 0; i < photoData.length; i++) {
        if (props.plantName && photoData[i].photoType) {
            const res = await uploadFile(getPhotoName(photoData[i], i), photoData[i].isReferencePhoto ? 'referencePhotos' : 'plantPhotos', photoData[i].file)
            console.log(res)
            if (res) {
                photoData[i].filePath = res
                fileUploadCounter++
                if (i+1 == photoData.length) {
                    showToastMessage(`${fileUploadCounter} of ${photoData.length} files uploaded`)
                }
            }
            //TODO: emit filePath change to ProductAdmin and save that to the firebase db
        } else {
            console.log(photoData[i], i)
            alert('Unable to upload due to missing info on photo ' + (i + 1))
        }
    }
}

function showToastMessage(message) {
    state.successMessage = message
    state.successMessageToast.show()
}

function removePhoto(index: number) {
    //TODO: Add logic to check if photo has been uploaded to firebase, delete it
    photoData.splice(index, 1)
}
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