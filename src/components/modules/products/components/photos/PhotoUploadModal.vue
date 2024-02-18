<template>
    <div
        id="photoUploadModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="photoUploadModal"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Upload Photo(s)</h5>
                    <button 
                    type="button" 
                    class="btn-close" 
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    @click="$emit('closeModal')"
                    ></button>
                </div>
                <div class="modal-body">
                    <div class="mx-5">
                        <label for="formFile" class="btn btn-primary">
                            Select Files
                        </label>
                        <input 
                        ref="fileSelectElement"
                        class="form-control" 
                        type="file" 
                        id="formFile" 
                        @change="onFileChanged($event)" 
                        accept="capture=camera,image/*" 
                        multiple>
                        <div v-if="selectedFiles.length !== 0" class="d-inline-block mx-3">{{ selectedFiles.length }} files selected</div>
                    </div>
                        <TransitionGroup name="list">
                            <div
                                v-for="(photo, index) of selectedFiles"
                                :key="index"
                                class="row my-4 d-flex align-content-center text-align-center">
                                <div class="col-1 d-flex flex-column align-items-center justify-content-center">
                                    <button 
                                    class="btn px-1 py-0"
                                    v-if="index !== 0"
                                    @click="arrayMove(selectedFiles,index,index-1)">
                                        <FontAwesome 
                                        class="move-arrow" 
                                        icon="caret-up" />
                                    </button>
                                    <button
                                    v-if="index !== selectedFiles.length -1"
                                    class="btn px-1 py-0"
                                    @click="arrayMove(selectedFiles,index,index+1)" >
                                        <FontAwesome  
                                        class="move-arrow" 
                                        icon="caret-down" />
                                    </button>

                                </div>
                                <div class="col-3 d-flex flex-column align-items-center justify-content-center">
                                    <div>{{ photo.name }}</div>
                                    <div class="form-floating w-100">
                                        <select name="photoTypeSelect py-0" id="photoTypeSelect" class="form-select" v-model="photo.type">
                                            <option v-for="item of PhotoTypes" :value="item" :key="item">{{ item }}</option>
                                        </select>
                                        <label for="photoTypeSelect">Select Photo Type</label>
                                    </div>
                                    
                                </div>
                                
                                <div class="col-7 d-flex  align-items-center justify-content-center">
                                    <img class="imagePreview" :src="photo.tempUrl"/>
                                </div>
                                <div class="col-1 d-flex align-items-center justify-content-center">
                                    <div class="btn " @click="removePhoto(index)">
                                    <FontAwesome icon="dumpster-fire" size="lg" style="color: #f29c07;" />
                                </div>
                                </div>
                                
                                
                            </div>
                        </TransitionGroup>
                </div>
                <div class="modal-footer modal-footer--sticky border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('closeModal')">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="uploadFiles">Upload</button>
                </div>
            </div>
        </div>
    </div>
    
    </template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { uploadFile } from '@/apis/fileServices';
import type {PhotoItem} from '@/components/modules/products/types/product'
import { PhotoTypes } from '@/components/modules/products/types/product'

const emit = defineEmits(['closeModal', 'showToast', 'updatePhotoData'])
const props = defineProps(['storageFolder', 'photos'])
const selectedFiles: Array<{
    file?: File, 
    tempUrl: string, 
    name: string,
    type?: PhotoTypes | undefined
}> = reactive([])


watch(props.photos, (newVal, oldVal) => {
    console.log('banana')
    console.log(newVal)
    console.log(oldVal)
    console.log(props.photos)
    selectedFiles.length = 0
    for(let photo of props.photos) {
        selectedFiles.push(photo)
    }
})
watch(props.photos, () => {
    console.log(props.photos)
    //TODO: need to combine concept of selectedFiles with props.photos.  Maybe just do away with selectedFiles and just make sure to save state before unmounted?
})
const photoDetails: Array<PhotoItem> = reactive([])

function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i = 0; i < target.files.length; i++) {
            selectedFiles.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i]),
                name: target.files[i].name,
            })
        }
    }    
}

function removePhoto(index: number) {
    selectedFiles.splice(index,1)
}

function arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    if(toIndex > arr.length-1) {console.log('Unable to move in array, toIndex greater than arr.length. toIndex:' + toIndex + 'arr.length: ' + arr.length)}
    const ele = arr[fromIndex]
    arr.splice(fromIndex,1)
    arr.splice(toIndex, 0, ele)
}

async function uploadFiles() {
    const photosToUpload = selectedFiles.filter((photo) => photo.file)
    if(photosToUpload.length === 0) {
        emit('showToast',{message: `No files to upload`, type: 'error'})
        return
    }
    let fileUploadCounter = 0
    for (let photo of photosToUpload) {
        if(!photo.file) continue
        const res = await uploadFile(photo.name, props.storageFolder, photo.file)
        if (res) {
            photoDetails.push({
                name: photo.name,
                type: photo.type ? photo.type : PhotoTypes.Additional,
                path: res,
                originalFilename: photo.name,
                
            })

            fileUploadCounter++
            if (fileUploadCounter >= photosToUpload.length) {
                emit('closeModal')
                emit('showToast',{message: `${fileUploadCounter} of ${photosToUpload.length} files uploaded`, type: 'success'})
                emit('updatePhotoData',photoDetails)
            }
        } else {
            emit('showToast',{message: `Sorry, something went wrong`, type: 'error'})
        }
    }
}

</script>

<style scoped>
input[type="file"] {
    display: none;
}

.imagePreview {
    height: 20em;
}

.modal-footer--sticky {
  position: sticky;
  bottom: 0;
  background-color: inherit; /* [1] */
  z-index: 1055; /* [2] */
}

.move-arrow {
    --fa-li-margin: 0
}

.list-move {
    transition: transform .75s
}

.list-enter-active, .list-leave-active {
    transition: all .75s;
}

.list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>