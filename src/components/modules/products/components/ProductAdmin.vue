<template>
    <form>
        <div class="container">
            <div class="row my-4 g-3 align-items-center ">
                <div class="btn-group col-6" role="group" aria-label="Select genus filters">
                    <label v-for="genus of productStore.getGenusList" :key="genus.id" class="btn btn-outline-primary" :for="genus.label"  @click="filterByGenus()">
                    <input type="checkbox" class="btn-check" :name="genus.label" :id="genus.id" autocomplete="off" v-model="filters.genus">
                        {{ genus.label }}</label>
                </div>
                <div class="col-auto">
                    <select name="editProduct" class="form-select" aria-label="Select a product to edit" @change="getProductDetails" v-model="productToEdit">
                        <option id="placeholder" selected disabled value="">Select a product to edit</option>
                        <option v-for="product of products" :value="product.id" >{{ product.name }} ({{ product.id }})</option>
                    </select>
                </div>
            </div>
        </div>
    </form>
    

<form class="container" @submit.prevent>
    <div class="align-items-center">
        <h3 v-if="formData.id">Edit Existing Product</h3>
        <h3 v-else>Creating a New Product</h3>
    </div>
    <div class="row g-3 align-items-center">
        <div class="col-2 mb-3">
            <label for="genus" class="form-label">Genus</label>
            <select name="genus" class="form-select" aria-label="Select Genus" v-model="formData.genus">
                <option id="placeholder" selected disabled value="">Select Genus</option>
                <option v-for="genus of productStore.genusList" :value="genus">{{ genus.label }}</option>
            </select>
        </div>
        <div class="col-5 mb-3">
            <label for="name" class="form-label">Name</label>
            <input name="name" class="form-control" type="text" v-model="formData.name">
        </div>
        <div class="col-1 mb-3">
            <label for="specimenNumber" class="form-label">Specimen #</label>
            <input name="specimenNumber" class="form-control" type="number" v-model="formData.specimenNumber">
        </div>
        <div class="col mb-3">
            <label for="propagationType" class="form-label">Propagation Method</label>
            <input name="propagationType" class="form-control" type="text" v-model="formData.propagationMethod">
        </div>
        <div class="col mb-3">
            <label for="source" class="form-label">Source</label>
            <input name="source" class="form-control" type="text" v-model="formData.source">
        </div>
        
    </div>
    <div class="row">
        <div class="col-auto mb-3">
            <label for="price" class="form-label">Price</label>
            <input name="price" class="form-control" type="number" v-model.number="formData.price">
        </div>
        <div class="col-auto mb-3">
                <label for="quantity" class="form-label">Available Quantity</label>
                <input name="quantity" class="form-control" type="number" v-model.number="formData.quantity">
            </div>
        <div class="col-auto mb-3 align-items-center form-check form-switch">
                <label for="forSale" class="form-check-label">Available for Sale</label>
                <input name="forSale" class="form-check-input" type="checkbox" v-model="formData.isForSale">
        </div>
    </div>
    <div class="row justify-content-around d-flex flex-row mt-4">
        <button type="button" class="col-auto btn btn-danger mx-4" @click="confirmDelete" >Delete Product</button>
        <button type="button" class="col-auto btn btn-secondary mx-4" @click="resetForm">Reset Form</button>
        <button type="button" class="col-1 btn btn-primary mx-4" @click="saveProduct">Save</button>
    </div>
    <hr class="mt-5"/>
    <div class="row">
        <PhotoUpload :plantId="formData.id" :plantName="formData.name" />
    </div>
</form>

<BaseModal 
    ref="confirmDeleteModal"
    id="confirmDeleteModal"
>
    <template #title>Are you sure?</template>
    <template #body>
        <div>Are you sure you want to delete this product?<br><br>ID:{{ formData.id }} - {{ formData.name }}</div>
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

<div class="toast-container position-absolute p-5 top-0 end-0"><BaseToast
    ref="successMessageToast"
    id="successMessageToast"
    type="success"
>
    <template #toastBody>{{ state.successMessage }}</template>
</BaseToast></div>

</template>

<script setup lang="ts">
//TODO further research FormKit library
import { ref, reactive, onMounted, computed } from 'vue'
import { Modal, Toast } from 'bootstrap'
import { useProductStore } from '../stores/product'
import PhotoUpload from '@/components/app/UI/PhotoUpload.vue'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { getFilteredProducts: products} = storeToRefs(productStore)
const state = reactive({
    confirmDeleteModal: null,
    successMessageToast: null,
    successMessage: null,
    isEditMode: false,
})
const productToEdit = ref("")

    // genusList: ['Nepenthes', 'Heliamphora', 'Cephalotus'],
    // propagationMethodList: ['Stem Cutting', 'Basal Division', 'Division', 'Seed', 'Tissue Culture', 'Other', 'Unknown'],
    // sourceList: ['Borneo Exotics', 'Exotica Plants', 'Wistuba', 'eBay/Facebook', 'Other', 'Unknown'],
    // growingConditionsList: ['Highland', 'Intermediate'],
    // experienceLevelList: ['Beginner', 'Intermediate', 'Expert'],
    // classificationList: ['Species', 'Hybrid', 'Registered Cultivar', 'Unregistered Cultivar'],

const formData = reactive({
    id: null,
    genus: null,
    specimenNumber: null,
    name: null,
    propagationMethod: null,
    source: null,
    price: null,
    isForSale: true,
    quantity: null,
})

const filters = reactive({
    genus: []
})
onMounted(() => {
    state.confirmDeleteModal = new Modal('#confirmDeleteModal', {})
    state.successMessageToast = new Toast('#successMessageToast')
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})


function getProductDetails(event) {
    const productId = event.target.value
    if (productId) {
        productStore.findProductById(productId).then((res) => {
            if (res) {
                if (res.length === 0) {
                    console.log(res)
                    alert('Unable to find product with that ID')
                } else {
                    if (res) {
                        for (let key in formData) {
                            formData[key] = res[key]
                        }
                    }
                } 
            }
        })
    }
}


function resetForm() {
    for (let key in formData) {
        formData[key] = null
    }
    formData.genus = ""
    productToEdit.value = ""
} 

function saveProduct() {
    if (!validateProduct()) {
        alert("Failed validation, bro")
    } else {
        productStore.saveProduct(formData).then((res) => {
            if (res.success) {
                showToastMessage(res.message)
                resetForm()
            } else {
                alert(res.message)
                console.log(res)
            }
            console.log(res)
            
        }).catch((err) => {
            console.log(err)
        })
    }

}

function validateProduct() {
    //TODO: Need to add validation
    return true
}

function confirmDelete() {
    state.confirmDeleteModal.show()

}

function deleteProduct() {
    if (productToEdit) {
        productStore.deleteById(productToEdit.value).then((res) => {
            console.log(res)
            state.confirmDeleteModal.hide()
            showToastMessage(`Product ${productToEdit.value} successfully deleted.`)
            resetForm()
        }).catch((err) => {
            console.log(err)
            alert('Unable to delete')
        })
    }
}

function showToastMessage(message) {
    state.successMessage = message
    state.successMessageToast.show()
}

function filterByGenus() {
    console.log(this.filters.genus)
    //productStore.setFilterCriteria('genus', genus)
}

</script>

<style>
input::-webkit-inner-spin-button {
    -webkit-appearance: none
}
</style>

//TODO: Make product select dropdown display by genus
//TODO: Add product filters
//TODO: Add Bootstrap Floating labels... bc they are cool
//TODO: implement button groups for various data
//TODO: fix product filters with button groups - they are additive but need to let me pick a diff option