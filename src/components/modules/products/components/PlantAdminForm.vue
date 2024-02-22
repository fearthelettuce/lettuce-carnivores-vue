<template>
    <form @submit.prevent>
        <div class="align-items-center">
            <h3 v-if="plant?.id">Edit Existing Plant</h3>
            <h3 v-else>Creating a New Plant</h3>
        </div>
        <div class="form-grid">
            <div class="form-floating grid-item-lg">
                <input name="name" 
                class="form-control" 
                type="text" 
                v-model="plant.name" 
                placeholder="Name"
                @change="updateGenus">
                <label for="name" class="">Name</label>
            </div>
            <div class="form-floating">
                <input name="id" class="form-control" type="id" v-model="plant.id" placeholder="ID" required>
                <label for="id">ID</label>
            </div>
            <div class="form-floating">
                <input name="source" 
                class="form-control" 
                type="text" 
                v-model="plant.source" 
                placeholder="Source"
                list="sourceList">
                <label for="source">Source</label>
            </div>
            <div class="form-floating">
                <input name="clone" class="form-control" type="text" v-model="plant.clone" placeholder="Clone">
                <label for="clone">Clone</label>
            </div>
            <div class="form-floating">
                <input name="acquisitionDate" 
                    class="form-control" 
                    type="text" 
                    v-model.lazy="plant.acquisitionDate" 
                    placeholder="Acquisition Date">
                <label for="propagaionDate">Acquisition Date</label>
            </div>
            <div class="form-floating grid-item-xl grid-item-two-rows">
                <textarea name="description" 
                class="form-control" 
                style="height: 10rem;"
                v-model="plant.description" 
                placeholder="Description"></textarea>
                <label for="description">Description</label>
            </div>
        </div>
        <div class="action-grid">
            <button type="button" class="btn btn-danger" :class="!plant.id && !plant.name ? 'disabled' : ''" @click="confirmDelete">Delete plant</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">Reset Form</button>
            <button type="button" class="btn btn-primary" @click="savePlant">Save</button>
            <button type="button" class="btn btn-primary" @click="saveAndNew">Save & New</button>
        </div>
        
    </form>
    
    <BaseModal ref="confirmDeleteModalRef">
        <template #title>Are you sure?</template>
            <template #body>
                <div>Are you sure you want to delete this plant?<br><br> {{ plant.name }}({{ plant.id }})</div>
            </template>
            <template #modalAction>
                <button 
                type="button" 
                class="btn btn-danger"
                @click="deletePlant"
                >
                Delete
                </button>
            </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import { useplantStore } from '../stores/plant'
import type { Plant } from '../types/plants'
import BaseModal from '@/components/app/UI/BaseModal.vue';

const plantStore = usePlantStore()

const { getPlantToEdit: plant } = storeToRefs(plantStore)

const state = reactive({
    isSaved: false,
    successMessage: String,
    isEditMode: false,
})

const confirmDeleteModalRef = ref<InstanceType<typeof BaseModal> | null>(null)

onMounted(() => {
    if (!plantStore.plantList || plantStore.plantList.length === 0) {
        plantStore.fetchSearchResults()
    }
})

function updateGenus () {
    let parsedGenus: string;
    const firstChar = plant.value.name.charAt(0).toLowerCase();
    switch (firstChar) {
        case 'c':
            parsedGenus = 'Cephalotus'
            break;
        case 'd':
            parsedGenus = 'Drosera';
            break;
        case 'h':
            parsedGenus = 'Heliamphora';
            break;
        case 'n':
            parsedGenus = 'Nepenthes';
            break;
        case 'p':
            parsedGenus = 'Pinguicula';
            break;
        default:
            parsedGenus = '';
            break;
    }
    plant.value.genus = parsedGenus ?? undefined;
}

function resetForm() {
    plantStore.setplantToEdit(null)
    state.isSaved = false
}

async function savePlant() {
    if (!validatePlant()) {
        toast.error('Invalid plant, missing ID')
        return
    }
    const res = await plantStore.savePlant(plant.value as Plant)
    if (res && res.success && res.message) {
        toast.success(res.message)
        state.isSaved = true
    } else {
        if (res && res.message) {
            toast.error(res.message)
            state.isSaved = false
        }
    }
}

function confirmDelete() {
    confirmDeleteModalRef.value?.showModal()
}

async function deletePlant() {
    if (plant.value.id) {
        const res = await plantStore.deleteById(plant.value.id)
        if (res && res.success) {
            toast.success(res.message)
            confirmDeleteModalRef.value?.hideModal()
            resetForm()
        } else {
            if(res && res.message) {
                toast.error(res.message)
            }
        }
    }
}

async function saveAndNew() {
    await savePlant()
    resetForm()
}

function validatePlant() {
    //TODO: Need to add validation
    //must have ID to save
    if(plant.value.id) {return true}
    else {return false}
}

</script>

<style scoped>
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
    grid-auto-rows: 1fr;
    grid-gap: 0 .5rem;
    grid-auto-flow: row;
}
label {
    height: 3rem;
}
.form-check {
    margin: auto;
}
.form-floating {
    margin: 0;
    padding: 0;
}
.grid-item-sm {
    grid-column: span 1;
}

.grid-item-lg {
    grid-column: span 2;
}
.grid-item-xl {
    grid-column: 1 / -1;
}

.grid-item-two-rows {
    grid-row: span 2;   
}

.action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    grid-gap: 2rem;
    margin: 3rem 2rem;
}


input::-webkit-inner-spin-button {
    -webkit-appearance: none
}

@media (min-width: 40rem) {
    .form-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>