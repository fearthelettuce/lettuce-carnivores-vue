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
                        accept="image/*" 
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
                                        <fa 
                                        class="move-arrow" 
                                        icon="caret-up" />
                                    </button>
                                    <button
                                    v-if="index !== selectedFiles.length -1"
                                    class="btn px-1 py-0"
                                    @click="arrayMove(selectedFiles,index,index+1)" >
                                        <fa  
                                        class="move-arrow" 
                                        icon="caret-down" />
                                    </button>

                                </div>
                                <div class="col-3 d-flex align-items-center justify-content-center">{{ photo.name }}</div>
                                
                                <div class="col-7 d-flex  align-items-center justify-content-center">
                                    <img class="imagePreview" :src="photo.tempUrl"/>
                                </div>
                                <div class="col-1 d-flex align-items-center justify-content-center">
                                    <div class="btn " @click="removePhoto(index)">
                                    <fa icon="dumpster-fire" size="lg" style="color: #f29c07;" />
                                </div>
                                </div>
                                
                                
                            </div>
                        </TransitionGroup>
                </div>
                <div class="modal-footer modal-footer--sticky border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('closeModal')">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="$emit('closeModal')">Upload</button>
                </div>
            </div>
        </div>
    </div>
    
    </template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { uploadFile } from '@/apis/fileServices';

const fileSelectElement = ref('fileSelectElement')
const selectedFiles: Array<{file?: File, tempUrl: string, name: string, order: number}> = reactive([])

function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i: number = 0; i < target.files.length; i++) {
            selectedFiles.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i]),
                name: target.files[i].name,
                order: i
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