<template>
    <form @submit.prevent class="plant-admin-form">
        <FormKit 
            type="text"
            label="ID"
            number
            v-model="plantCategoryToEdit.id"
        />
        <FormKit 
            type="text"
            label="Name"
            outer-class="grid-col-2"
            v-model="plantCategoryToEdit.name" 
        />
        <FormKit 
            type="text"
            label="Genus"
            v-model="plantCategoryToEdit.genus" 
        />
        <FormKit
            type="text"
            label="Clone"
            v-model="plantCategoryToEdit.clone" 
        />
        <FormKit
            type="text"
            label="Status"
            v-model="plantCategoryToEdit.status" 
        />
        <FormKit
            type="textarea"
            label="Description"
            outer-class="grid-col-5"
            v-model="plantCategoryToEdit.description" 
        />
    </form>
    <section class="form-actions">
        <button class="btn btn-danger form-action" @click.prevent="savePlant" :disabled="!plantCategoryToEdit.id">
            Delete Plant<span class="spinner-border" role="status" v-if="isSaving"></span>
        </button>
        <button class="btn btn-secondary form-action" @click.prevent="setCategoryToEdit(null)">
            Reset Form
        </button>
        <button class="btn btn-info form-action" @click.prevent="savePlant">
            Add Photos
        </button>
        <button class="btn btn-primary form-action" @click.prevent="savePlant" :disabled="isSaving">
            Save Plant<span class="spinner-border" role="status" v-if="isSaving"></span>
        </button>
    </section>
    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePlantStore } from '../stores/plant';
import { storeToRefs } from 'pinia';

const {saveCategory, setCategoryToEdit} = usePlantStore()
const isSaving = ref(false);
const {plantCategoryToEdit} = storeToRefs(usePlantStore())

async function savePlant() {
    if(!plantCategoryToEdit.value.id){return}
    isSaving.value = true
    await saveCategory(plantCategoryToEdit.value)
    isSaving.value = false
}


</script>

<style scoped>

    .plant-admin-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
        margin-bottom: 2rem;
        gap: 0 2em;
    }
    .form-action {
        min-width: 12rem;
    }
    .form-actions {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin-bottom: 2rem;
        gap: 0 2em;
    }
    .spinner-border {
        height: 1rem;
        width: 1rem;
        margin-left: 1rem;
    }
</style>