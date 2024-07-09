<template>
    <form @submit.prevent class="plant-admin-form">
        <FormKit 
            type="text"
            label="ID"
            number
            validation="required|number"
            validation-visibility="blur"
            class="grid-col-1"
            v-model="plantCategoryToEdit.id"
        />
        <FormKit 
            type="text"
            label="Name"
            outer-class="grid-col-2"
            v-model="plantCategoryToEdit.name" 
        />
        <FormKit 
            type="select"
            label="Genus"
            :options="genusList"
            class="grid-col-1"
            v-model="plantCategoryToEdit.genus" 
        />
        <FormKit
            type="text"
            label="Clone"
            class="grid-col-1"
            v-model="plantCategoryToEdit.clone" 
        />
        <FormKit
            type="select"
            label="Status"
            :options="statusList"
            class="grid-col-1"
            v-model="plantCategoryToEdit.status" 
        />
        <FormKit
            type="textarea"
            label="Description"
            outer-class="description"
            v-model="plantCategoryToEdit.description" 
        />
    </form>
    <section class="form-actions">
        <button class="btn btn-danger form-action" @click.prevent="confirmDelete" :disabled="!plantCategoryToEdit.id">
            Delete Plant<span class="spinner-border" role="status" v-if="isSaving"></span>
        </button>
        <button class="btn btn-secondary form-action" @click.prevent="setCategoryToEdit(null)">
            Reset Form
        </button>
        <button class="btn btn-info form-action" @click.prevent="addPhotos">
            Photos <span>({{ plantCategoryToEdit.photos.length }})</span>
        </button>
        <button class="btn btn-primary form-action" @click.prevent="saveCategory(plantCategoryToEdit)" :disabled="isSaving">
            Save<span class="spinner-border" role="status" v-if="isSaving"></span>
        </button>
    </section>

    <BaseModal ref="confirmDeleteModalRef">
        <template #title>Are you sure?</template>
            <template #body>
                <div>Are you sure you want to delete this product?<br><br> {{ plantCategoryToEdit.name }}({{ plantCategoryToEdit.id }})</div>
            </template>
            <template #modalAction>
                <button 
                type="button" 
                class="btn btn-danger"
                @click="deleteProduct"
                >
                Delete
                </button>
            </template>
    </BaseModal>
    
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { toast } from 'vue3-toastify'
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';
import BaseModal from '@/components/app/UI/BaseModal.vue'

const {saveCategory, setCategoryToEdit, deleteCategoryById, genusList, statusList} = usePlantStore()
const {plantCategoryToEdit, isSaving} = storeToRefs(usePlantStore())


const confirmDeleteModalRef = ref<InstanceType<typeof BaseModal> | null>(null)

function confirmDelete() {
    //TODO add logic to check if any active plants, show in modal?
    confirmDeleteModalRef.value?.showModal()
}

async function deleteProduct() {
    if (plantCategoryToEdit.value.id) {
        const res = await deleteCategoryById(plantCategoryToEdit.value.id).catch(err => console.error(err))
        if (res && res.success) {
            toast.success(res.message)
            confirmDeleteModalRef.value?.hideModal()
        } else {
            if(res && res.message) {
                toast.error(res.message)
            }
        }
    }
}


const managePhotos = inject<Function>('managePhotos')

function addPhotos() {
    if(managePhotos === undefined) { return }
    managePhotos('plantCategories', plantCategoryToEdit.value.photos)
}


</script>

<style scoped>

    .plant-admin-form {
        margin: 2rem 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, 10rem);
        gap: .5rem;
    }
    .form-action {
        min-width: 7rem;
    }
    .form-actions {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-evenly;
        margin-bottom: 2rem;
        gap: 1.5em 1.5em;
    }
    .spinner-border {
        height: 1rem;
        width: 1rem;
        margin-left: 1rem;
    }
    .description {
        grid-column: span 3;
    }

    @media(min-width: 45rem) {
        .plant-admin-form {
            grid-template-columns: repeat(6, 1fr);
        }
        .form-actions {
            flex-wrap: nowrap;
        }
        .description {
        grid-column: span 4;
    }
    }
    @media(min-width: 120rem) {
        .plant-admin-form {
            grid-template-columns: repeat(10, 1fr);
        }
        .description {
        grid-column: span 6;
    }
    }
</style>