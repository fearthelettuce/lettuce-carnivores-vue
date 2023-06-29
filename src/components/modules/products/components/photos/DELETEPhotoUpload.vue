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
        <PhotoUploadItem v-if="photoData.length" v-for="(photo, index) of photoData" :key="index" :photo="photo" @removePhoto="removePhoto(index)"/>
        <!-- <div v-if="photoData.length > 0" v-for="(photo, index) of photoData" class="row my-3">
            <div class="col-3 imagePreviewContainer">
                <img :src="photo.tempUrl ? photo.tempUrl : photo.fullPath ? productStore.getPhotoUrl(photo.fullPath) : ''" class="imagePreview"/>
            </div>
            <div class="col-3 d-flex justify-content-center align-items-center">
                <label for="imageType">{{photo?.file ? photo.file.name : photo[Object.keys(photo)[0]] ? photo[Object.keys(photo)[0]].name : ''}}</label>
            </div>
            <div class="col-1 form-check form-switch d-flex justify-content-center align-items-center">
                <input id="isReferencePhoto" type="checkbox" class="form-check-input text-primary " v-model="photo.isReferencePhoto" />
            </div>
            <div class="col-2 mx-2 d-flex justify-content-center align-items-center">
                <select name="genus" class="form-select" aria-label="Select Genus" v-model="photo.photoType">
                    <option id="placeholder" disabled value="">Select Photo Type</option>
                    <option v-for="item of photoTypes" :value="item.id">{{ item.label }}</option>
                </select>
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <div class="btn" @click="removePhoto(index)"><fa icon="dumpster-fire" size="lg" style="color: #f29c07;" /></div>
            </div>
        </div> -->
        <div>
            <div class="row justify-content-around d-flex flex-row mt-4">
                <button type="button" class="col-2 btn btn-primary mx-4" :disabled="photoData?.length === 0 ? true : false" @click="savePhotoData">Upload Images</button>
            </div>
        </div>
    </div>
    <div class="toast-container position-absolute p-5 top-0 end-0">
            <BaseToast
            ref="fileUploadToast"
            id="fileUploadToast"
            type="success"
            >
                <template #toastBody>{{ state.fileUploadMessage }}</template>
            </BaseToast>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRaw, watch } from 'vue';
import { Toast } from 'bootstrap'
import { useProductStore } from '@/components/modules/products/stores/product';
import { ProductPhotos } from '@/components/modules/products/types/product';
import PhotoUploadItem from './PhotoUploadItem.vue';
import { uploadFile } from '@/apis/fileServices';

const productStore = useProductStore()
const files = ref<FileList | null>();
const form = ref<HTMLFormElement>();
const photoData = reactive([])
const props = defineProps(['selectedPlant','plantId', 'plantName'])
const state = reactive({
    // selectedPlant: {},
    fileUploadToast: null,
    fileUploadMessage: null,
})

onMounted(async () => {
    state.fileUploadToast = new Toast('#fileUploadToast')
    console.log(props.selectedPlant.photoData)
    if (props.selectedPlant.photoData) {
        const propPhotos = toRaw(props.selectedPlant.photoData)
        Object.entries(propPhotos).map((entry) => photoData.push({ [entry[0]]: entry[1] }))
    }
    console.log(photoData)
    // if (props.plantId) {
    //     let somePlant = await productStore.findProductById(props.plantId).catch((err) => {
    //         console.log(err)
    //         alert('Unable to find plant')
    //     })
    //     if (somePlant) {
    //         state.selectedPlant = somePlant
    //     }
    //     console.log(state.selectedPlant.photoData)
    // }
    //Get product by ID
    // console.log('onMounted log')
    // console.log(props.selectedPlant.name)
    // console.log(props.selectedPlant.photoData)
})

// watch(() => props.selectedPlant, (newVal) => {
//     console.log('prop changed')
//     console.log(props.selectedPlant.name)
//     console.log(props.selectedPlant.photoData)
// })

// const imageData = reactive({
//     isReference: false,
//     imageData: {
//         name: null,
//         cardImageUrl: null,
//         primaryProductImageUrl: null,
//         additionalProductImageUrls: [],
//         upperPitcherImageUrl: null,
//         lowerPitcherImageUrl: null
//     }

// })

const photoTypes = [
        { id: 'primary', label: 'Primary' },
        { id: 'card', label: 'Card' },
        { id: 'additional', label: 'Additional' },
        { id: 'upper', label: 'Upper'},
        { id: 'lower', label: 'Lower' }
]
    
function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i = 0; i < target.files.length; i++) {
            photoData.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i])
            })
        }
    }    
}

async function savePhotoData() {
    if (!props.plantId) {
        alert('Please save plant data before uploading')
        return
    }
    const photosUploaded = await uploadPhotos().catch(err => console.log(err))
    if (photosUploaded) {
        productStore.updatePhotoData(props.plantId, photosUploaded)
    }

}

async function uploadPhotos() {
    let fileUploadCounter = 0
    let productPhotoData: ProductPhotos = {
        primary: null,
        card: null,
        additional: [],
        upper: null,
        lower: null,
    }
    for (let i = 0; i < photoData.length; i++) {
        if (props.plantName && photoData[i].photoType) {
            const photoName = getPhotoName(photoData[i], i)
            const res = await uploadFile(photoName, photoData[i].isReferencePhoto ? 'referencePhotos' : 'plantPhotos', photoData[i].file)
            if (res) {
                //if (photoData[i].photoType === 'additional') {
                if (Array.isArray(productPhotoData[photoData[i].photoType])) {
                    productPhotoData[photoData[i].photoType].push(
                        {
                            fullPath: res,
                            name: photoName,
                            originalFileName: photoData[i].file.name,
                        }
                    )
                } else {
                    let keyName = photoData[i].photoType
                    productPhotoData[keyName] = {
                        fullPath: res,
                        name: photoName,
                        originalFileName: photoData[i].file.name,
                        order: i
                    }
                }

                fileUploadCounter++                
                if (i + 1 == photoData.length) {
                    showToastMessage(`${fileUploadCounter} of ${photoData.length} files uploaded`)
                    if (fileUploadCounter > 0) {
                        return productPhotoData
                    }
                }
            }
        } else {
            alert(`Unable to upload due to missing info on photo ${i + 1} - ${photoData[i].file.name} `)
        }
    }
}

// async function uploadPhotos() {
//     let fileUploadCounter = 0
//     let productPhotoData: ProductPhotos
//     const rawPhotoData = toRaw(photoData)
//     console.log(rawPhotoData)
//     for (let { photo, index } of rawPhotoData) {
//         console.log(photo) 
//         if (props.plantName && photo.photoType) {
//             const photoName = getPhotoName(photo, index)
//             const res = await uploadFile(photoName, photo.isReferencePhoto ? 'referencePhotos' : 'plantPhotos', photo.file)
//             console.log(res)
//             if (res) {
//                 if (photo.photoType.typeValue === 'additional') {
//                     productPhotoData[photo.photoType.typeValue].push(
//                         {
//                             fullPath: res,
//                             name: photoName
//                         }
//                     )
//                 } else {
//                     productPhotoData[photo.photoType.typeValue] =
//                         {
//                             fullPath: res,
//                             name: photoName
//                         }
//                 }
//                 fileUploadCounter++
//                 if (index + 1 == photoData.length) {
//                     if (fileUploadCounter > 0) {
//                         return productPhotoData
//                     }
//                     showToastMessage(`${fileUploadCounter} of ${photoData.length} files uploaded`)

//                 }
//             }
//         }
//     }
// }


function getPhotoName(photo, index) {
    //TODO: add better logic to handle duplicate types
    const fileExtension = photo.file.name.split('.').pop()
    return `${props.plantName} - ${photo.photoType} - ${index}.${fileExtension}`
}

function showToastMessage(message) {
    console.log('PhotoUpload.vue showToastMessage:' + message)
    state.fileUploadMessage = message
    state.fileUploadToast.show()
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
//TODO: Separate functionality for adding images and new images