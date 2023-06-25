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
                    <h5 class="modal-title" >Upload Photo(s)</h5>
                    <button 
                    type="button" 
                    class="btn-close" 
                    aria-label="Close"
                    data-bs-dismiss="modal"
                    @click="$emit('closeModal')"
                    ></button>
                </div>
                <div class="modal-body text-center">
                    <div class="col-9">
                    <input 
                    class="form-control" 
                    type="file" 
                    id="formFile" 
                    @change="onFileChanged($event)" 
                    accept="image/*" 
                    multiple>
                </div>
                <div class="modal-body">
                    <div 
                        v-for="(photo, index) of selectedPhotos"
                        class="row my-4 d-flex align-content-center text-align-center">
                        <div class="col-3 d-flex align-items-center justify-content-center">{{ photo.name }}</div>
                        <div class="col-auto btn d-flex align-items-center justify-content-center" @click="removePhoto(index)">
                            <fa icon="dumpster-fire" size="lg" style="color: #f29c07;" />
                        </div>
                        <img class="col-auto imagePreview" :src="photo.tempUrl"/>
                        
                        
                    </div>
                </div>
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
import { reactive } from 'vue';
import { uploadFile } from '@/apis/fileServices';

const selectedPhotos: Array<{file?: File, tempUrl: string, name: string}> = reactive([])


function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target && target.files) {
        for (let i: number = 0; i < target.files.length; i++) {
            selectedPhotos.push({
                file: target.files[i],
                tempUrl: URL.createObjectURL(target.files[i]),
                name: target.files[i].name,
            })
        }
    }    
}

function removePhoto(index: number) {
    selectedPhotos.splice(index,1)
}
</script>
<style>

.imagePreview {
    height: 20em;
}

.modal-footer--sticky {
  position: sticky;
  bottom: 0;
  background-color: inherit; /* [1] */
  z-index: 1055; /* [2] */
}

</style>