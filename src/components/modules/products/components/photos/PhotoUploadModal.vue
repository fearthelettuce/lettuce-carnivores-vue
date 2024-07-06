<template>
    <BaseDialog :open="open" :inline="false" class="bg-dark border-0">
        <div >
            <div class="modal-header border-0">
                <h5 class="modal-title text-light">Upload Photo(s)</h5>
                <button 
                    type="button" 
                    class="btn btn-close" 
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    @click="toggleModal"
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
                <div class="modal-footer modal-footer--sticky border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="toggleModal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="uploadFiles">Upload</button>
                </div>
            </div>
        </div>

    </BaseDialog>
    
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { uploadFile } from '@/apis/fileServices';
import type {PhotoItem} from '@/components/modules/products/types/product'
import { PhotoTypes } from '@/components/modules/products/types/product'
import { toast } from 'vue3-toastify'
import BaseDialog from '@/components/app/UI/BaseDialog.vue';
import {getPhotoUrl} from '@/composables/usePhotoUtils'

const emit = defineEmits(['uploadSuccess'])
const props = defineProps<{storageFolder: string}>()

defineExpose({toggleModal})
const open = ref(false)

function toggleModal() {
    open.value = !open.value;
}


const selectedFiles: Array<{
    file?: File, 
    tempUrl: string, 
    name: string,
    type?: PhotoTypes | undefined,
}> = reactive([])

const photos = defineModel<PhotoItem[]>('photos')
watch(photos, (newVal, oldVal) => {
    selectedFiles.length = 0
    if(photos.value) {
        for(let photo of photos.value) {
            let item = {...photo, tempUrl: getPhotoUrl(photo.path)}
            selectedFiles.push(item)
        }
    }

})

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
    //TODO Delete photo from photos array if it's already uploaded
    // if ( photos.value.includes(index)) {
    //     photos.value.splice()
    // }
    //emit save
    //call delete that photo
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
        toast.warning('No files to upload')
        return
    }
    let fileUploadCounter = 0
    for (let photo of photosToUpload) {
        if(!photo.file) continue
        const res = await uploadFile(photo.name, props.storageFolder, photo.file)
        if (res && res.success === true && res.filePath) {
            // photoDetails.push({
            //     name: photo.name,
            //     type: photo.type,
            //     folder: props.storageFolder,
            //     path: res.filePath,
            //     originalFilename: photo.name,
            //     date: new Date(),
            //     isReferencePhoto: photo.isReferencePhoto,
            // })
            console.log('pushing to photos')
            if(photos && photos.value) {
                photos.value.push({
                name: photo.name,
                type: photo.type,
                folder: props.storageFolder,
                path: res.filePath,
                originalFilename: photo.name,
                date: new Date(),
            })
            console.log(photos.value)
            }
            
            fileUploadCounter++
            if (fileUploadCounter >= photosToUpload.length) {
                
                emit('uploadSuccess')
                toggleModal()
                toast.success(`${fileUploadCounter} of ${photosToUpload.length} files uploaded`)
                
            }
        } else {
            toast.error(`Sorry, something went wrong`)
        }
    }
    selectedFiles.length = 0;
    // photoDetails.length = 0;
}

</script>

<style scoped>
input[type="file"] {
    display: none;
}

.imagePreview {
    height: 20em;
}

.modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.modal-footer--sticky {
    position: sticky;
    bottom: 0;
    margin: 1rem 0;
    gap: .5rem;
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