<template>

    <BaseDialog :open="open" class="bg-dark border-0 rounded p-0">
        <div class="photo-modal p-3">
            <header class="mb-2 border-0">
                <h5 class="modal-title text-light">Manage Photos</h5>
                <p>Photos will take ~30s to load after uploading</p>
                <button 
                    type="button" 
                    class="btn-close btn-close-white" 
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    @click="toggleModal"
                ></button>
            </header>
            <div class="modal-body photo-items-grid">
                <TransitionGroup name="list">
                    <template
                        v-for="(photo, index) of photos"
                        :key="index"
                    >
                        <div class="grid-col-1 align-content-center text-center">
                            <div class="arrow-button">
                                <button
                                class="btn px-1 py-0"
                                v-if="index !== 0"
                                @click="arrayMove(photos,index,index-1)">
                                    <FontAwesome
                                    class="move-arrow"
                                    icon="caret-up" />
                                </button>
                            </div>
                            <div class="arrow-button">
                                <button
                                v-if="index !== photos.length -1"
                                class="btn px-1 py-0"
                                @click="arrayMove(photos,index,index+1)" >
                                    <FontAwesome
                                    class="move-arrow"
                                    icon="caret-down" />
                                </button>
                            </div>

                        </div>
                        <div class="grid-col-1 align-content-center text-light">
                            <div>{{ photo.name }}</div>                                
                        </div>
                        
                        <div class="col-7 d-flex  align-items-center justify-content-center">
                            <img class="imagePreview" :src="photoSrc(photo, 256)" />
                        </div>
                        <div class="col-1 d-flex align-items-center justify-content-center">
                            <div class="btn " @click="removePhoto(index, photo)">
                            <FontAwesome icon="dumpster-fire" size="lg" style="color: #f29c07;" />
                        </div>
                        </div>

                    </template>
                </TransitionGroup>
            </div>
            
                <footer class="bg-dark">
                        <div class="">
                            <label for="formFile" class="btn btn-primary" :disabled="isSaving">
                                Select Files
                            </label>
                            <input 
                            ref="fileSelectElement"
                            class="form-control" 
                            type="file" 
                            id="formFile" 
                            @change="onFileChanged($event)" 
                            accept="capture=camera,image/*" 
                            multiple
                            :disabled="isSaving">
                            <div v-if="selectedFiles.length !== 0" class="d-inline-block mx-3 text-light">{{ selectedFiles.length }} files selected</div>
                        </div>
                    <div class="d-flex flex-row gap-2">
                        <button type="button" class="btn btn-primary" @click="uploadFiles" :disabled="selectedFiles.length === 0 || isSaving">Upload <span v-if="isSaving" class="spinner-border"></span></button>
                        <button type="button" class="btn btn-info" @click="reloadImages" data-bs-dismiss="modal":disabled="isSaving || photos.length === 0">Reload Images</button>     
                        <button type="button" class="btn btn-secondary" @click="toggleModal" data-bs-dismiss="modal":disabled="selectedFiles.length !== 0">Close</button>
                    </div>

                </footer>
                
            
        </div>

    </BaseDialog>
    
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType, type Ref} from 'vue';
import { uploadFile } from '@/apis/fileServices';
import type {PhotoItem} from '@/types/Product'
import { toast } from 'vue3-toastify'
import BaseDialog from '@/components/app/UI/BaseDialog.vue';
import {getPhotoUrl, type AllowedSizes} from '@/composables/usePhotoUtils'

const emit = defineEmits(['triggerSave'])
const props = defineProps<{storageFolder: string}>()

defineExpose({toggleModal})

onMounted(() => {
    resetSelectedFiles()
})

const open = ref(false)

function toggleModal() {
    open.value = !open.value;
    resetSelectedFiles()
}

function reloadImages() {
    const imageDomElements = document.querySelectorAll('.imagePreview') as unknown as HTMLImageElement[]

    imageDomElements.forEach((ele)=>{
        const currentSource = ele.src
        ele.src = ''
        setTimeout(()=>{ele.src = currentSource},20)
    })
}

function photoSrc(photo: PhotoItem | SelectedFile, size: AllowedSizes = 256) {
    return getPhotoUrl((photo as PhotoItem).path, size)
}

const photos = defineModel('photos',{type: Object as PropType<PhotoItem[]>, required: true})

function arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    if(toIndex > arr.length-1) {console.log('Unable to move in array, toIndex greater than arr.length. toIndex:' + toIndex + 'arr.length: ' + arr.length)}
    const ele = arr[fromIndex]
    arr.splice(fromIndex,1)
    arr.splice(toIndex, 0, ele)
    emit('triggerSave')
}

function removePhoto(index: number, photo: SelectedFile| PhotoItem) {
    //const photoIndex = photos.value.findIndex((ele) => ele.originalFilename === photo.name)
    if(index !== -1) {
        console.log(photos.value[index])
        photos.value.splice(index,1)
        emit('triggerSave')
    }
}

//Selected Files
const selectedFiles: Ref<SelectedFile[]> = ref([])

type SelectedFile = {
    file?: File, 
    tempUrl: string, 
    name: string,
    originalName: string,
}

function resetSelectedFiles() {
    selectedFiles.value.length = 0
}

function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i = 0; i < target.files.length; i++) {
            selectedFiles.value.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i]),
                originalName: target.files[i].name,
                name: target.files[i].name.replace(/\.[^/.]+$/, ""),
            })
        }
    }    
}

const isSaving = ref(false)

async function uploadFiles() {
    const photosToUpload = selectedFiles.value.filter((photo) => photo.file)
    if(photosToUpload.length === 0) {
        toast.warning('No files to upload')
        return
    }
    isSaving.value = true
    let fileUploadCounter = 0
    for (let photo of photosToUpload) {
        if(!photo.file) continue
        const res = await uploadFile(photo.name, props.storageFolder, photo.file)
        if (res && res.success === true && res.filePath) {
            photos.value.push({
                name: photo.name,
                folder: props.storageFolder,
                path: res.filePath,
                originalFilename: photo.originalName,
                date: new Date(),
            })
            
            fileUploadCounter++
            if (fileUploadCounter >= photosToUpload.length) {
                emit('triggerSave')
                toast.success(`${fileUploadCounter} of ${photosToUpload.length} files uploaded`)
            }
        } else {
            toast.error(`Sorry, something went wrong`)
        }
    }
    selectedFiles.value.length = 0;
    isSaving.value = false
}

</script>

<style scoped>
input[type="file"] {
    display: none;
}
header {
    display: flex;
    justify-content: space-between;
    margin: 0 1.5rem 0;
    box-sizing: border-box;
}
footer {
    display: flex;
    padding-top: 1rem;
    justify-content: space-around;
    box-sizing: border-box;
}

.imagePreview {
    height: 16em;
}

.hide {
    display: none;
}
.photo-modal {
    min-width: 40rem;
    overflow: none;
}
.modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.modal-footer--sticky {
    position: sticky;
    bottom: 0;
    margin: .5rem 0;
    gap: .5rem;
}

.photo-items-grid {
    display: grid;
    grid-template-columns: 1fr 4fr 4fr 1fr;
    gap: 1rem 0;
    height: 75dvh;
    overflow-y:auto;
    min-height: 20rem;
}
.spinner-border {
    height: 1rem;
    width: 1rem;
    margin-left: 1rem;
}
.move-arrow {
    --fa-li-margin: 0
}
.arrow-button {
    min-width: 1rem;
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