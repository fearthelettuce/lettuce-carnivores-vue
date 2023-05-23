<template>
    <form class="container" @submit.prevent>
        <div class="align-items-center">
            <h3 v-if="product?.id">Edit Existing Product</h3>
            <h3 v-else>Creating a New Product</h3>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2 mb-3">
                <label for="genus" class="form-label">Genus</label>
                <select name="genus" class="form-select" aria-label="Select Genus" v-model="product.genus">
                    <option id="placeholder" selected disabled value="">Select Genus</option>
                    <option v-for="genus of productStore.genusList" :value="genus">{{ genus.label }}</option>
                </select>
            </div>
            <div class="col-5 mb-3">
                <label for="name" class="form-label">Name</label>
                <input name="name" class="form-control" type="text" v-model="product.name">
            </div>

            <div class="col-3 mb-3">
                <label for="propagationType" class="form-label">Propagation Method</label>
                <input name="propagationType" class="form-control" type="text" v-model="product.propagationMethod">
            </div>

        
        </div>
        <div class="row">
            <div class="col-3 mb-3">
                <label for="source" class="form-label">Source</label>
                <input name="source" class="form-control" type="text" v-model="product.source">
            </div>
            <div class="col-2 mb-3">
                <label for="price" class="form-label">Price</label>
                <input name="price" class="form-control" type="number" v-model.number="product.price">
            </div>
            <div class="col-3 mb-3">
                    <label for="quantity" class="form-label">Available Quantity</label>
                    <input name="quantity" class="form-control" type="number" v-model.number="product.quantity">
                </div>
            
        </div>
        <div class="row">
            <div class="col-auto mb-3 align-items-center form-check form-switch">
                    <label for="forSale" class="form-check-label">Available for Sale</label>
                    <input name="forSale" class="form-check-input" type="checkbox" v-model="product.isForSale">
            </div>
        </div>
        <div class="row justify-content-around d-flex flex-row mt-4">
            <button type="button" class="col-auto btn btn-danger mx-4" @click="confirmDelete" >Delete Product</button>
            <button type="button" class="col-auto btn btn-secondary mx-4" @click="resetForm">Reset Form</button>
            <button type="button" class="col-auto px-4 btn btn-primary mx-4" @click="saveProduct">Save</button>
            <button type="button" class="col-auto btn btn-primary mx-4" @click="saveAndNew">Save & New</button>
        </div>

        
    </form>

    <BaseModal 
        ref="confirmDeleteModal"
        id="confirmDeleteModal"
    >
        <template #title>Are you sure?</template>
        <template #body>
            <!-- <div>Are you sure you want to delete this product?<br><br>ID:{{ .id }} - {{ formData.name }}</div> -->
            <div>Are you sure you want to delete this product?<br><br>ID: Name:</div>
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

import { reactive, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/product'


const productStore = useProductStore()
const { getProductToEdit: product } = storeToRefs(productStore)

const state = reactive({
    isSaved: false,
    confirmDeleteModal: null,
    successMessageToast: null,
    successMessage: null,
    isEditMode: false,
})


function resetForm() {
    productStore.setProductToEdit(null)
    state.isSaved = false
}

function saveProduct() {
    // if (!validateProduct()) {
    //     alert("Failed validation, bro")
    // } else {
    //     let plantDetails = { ...formData, photoData: null }
    //     if (state.plant && state.plant.photoData) {
    //         plantDetails.photoData = { ...state.plant.photoData }
    //     }
    //     productStore.saveProduct(plantDetails).then((res) => {
    //         if (res.success) {
    //             showToastMessage(res.message)
    //             state.isSaved = true
    //             //TODO build this: state.plant =  ??
    //         } else {
    //             alert(res.message)
    //             console.log(res)
    //         }
    //         console.log(res)

    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }
}

function confirmDelete() {
    state.confirmDeleteModal.show()

}
function deleteProduct() {
        productStore.deleteById(this.product.id).then((res) => {
            console.log(res)
            state.confirmDeleteModal.hide()
            //showToastMessage(`Product ${productToEdit.value} successfully deleted.`)
            resetForm()
        }).catch((err) => {
            console.log(err)
            alert('Unable to delete')
        })
}

function saveAndNew() {
    this.saveProduct()
    this.resetForm()
}

function validateProduct() {
    //TODO: Need to add validation
    return true
}


</script>

<style scoped>

</style>