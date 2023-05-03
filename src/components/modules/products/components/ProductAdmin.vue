<template>
    <div class="container">
        <div class="row my-4 g-3 align-items-center">
            <div class="col-auto">
                <label for="productId" class="form-label">Product ID:</label>
            </div>
            <div class="col-auto">
                <input type="text" name="productId" class="form-control" v-model.number="enteredProductId">
            </div>
            <div class="d-flex col-2 align-items-center">
                <button type="button" class="btn btn-primary" @click="getProductDetails">Get Product Details</button>
            </div>
        </div>
    </div>


<form class="container">
    <div class="row g-3 align-items-center">
        <div class="col-2 mb-3">
            <label for="genus" class="form-label">Genus</label>
            <select name="genus" class="form-select" aria-label="Select Genus"  v-model="formData.genus">
                <option selected placeholder="Select Genus"></option>
                <option v-for="genus of productStore.genusList" :value="genus">{{ genus }}</option>
            </select>

            
        </div>
        <div class="col-5 mb-3">
            <label for="name" class="form-label">Name</label>
            <input name="name" class="form-control" type="text" v-model="formData.name">
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
        <button type="button" class="col-auto btn btn-danger mx-4" @click="showModal" >Delete Product</button>
        <button type="button" class="col-auto btn btn-secondary mx-4" @click="resetForm">Reset Form</button>
        <button type="button" class="col-1 btn btn-primary mx-4" @click="saveProduct">Save</button>
    </div>
    
</form>
<!-- <template v-slot="modalAction">
    <button type="button" class="btn" :class="actionButtonClass" @click="clickAction">{{ actionButtonLabel }}</button>
</template> -->
    <BaseModal 
        ref="confirmDeleteModal"
        id="confirmDeleteModal"

    >
    <template #title>Are you sure?</template>
    <template #body><p>poop</p></template>
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
            <!-- ref="confirmDeleteModalRef"
        modalId="confirmDeleteModal"
        modalTitle="Are you sure?"
        modalText="Are you sure you want to delete this product?"
        actionButtonLabel="Delete"
        actionButtonClass="btn-danger"
        @submitAction="deleteProduct" -->

    <!-- <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="exampleModalLabel">Are you sure?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            Are you sure you want to delete? <br>
            {{ formData.id }} {{ formData.name }}
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">Delete</button>
          </div>
        </div>
      </div>
    </div> -->

</template>

<script setup lang="ts">
//TODO further research FormKit library
import { ref, reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useProductStore } from '../stores/product'
import { Product } from '@/components/modules/products/types/product'

const enteredProductId = ref(null)

    // genusList: ['Nepenthes', 'Heliamphora', 'Cephalotus'],
    // propagationMethodList: ['Stem Cutting', 'Basal Division', 'Division', 'Seed', 'Tissue Culture', 'Other', 'Unknown'],
    // sourceList: ['Borneo Exotics', 'Exotica Plants', 'Wistuba', 'eBay/Facebook', 'Other', 'Unknown'],
    // growingConditionsList: ['Highland', 'Intermediate'],
    // experienceLevelList: ['Beginner', 'Intermediate', 'Expert'],
    // classificationList: ['Species', 'Hybrid', 'Registered Cultivar', 'Unregistered Cultivar'],

const formData = reactive({
    id: null,
    genus: null,
    name: null,
    propagationMethod: null,
    source: null,
    price: null,
    isForSale: true,
    quantity: null,
})

const state = reactive({
    confirmDeleteModal: null,
})

onMounted(() => {
    state.confirmDeleteModal = new Modal('#confirmDeleteModal', {})


})

function showModal() {
    state.confirmDeleteModal.show()
}

function hideModal() {
    state.confirmDeleteModal.hide()
}
const productStore = useProductStore()

function getProductDetails() {
    let productDetails: Product
    if (enteredProductId) {
        productStore.findProduct('id', enteredProductId.value).then((res) => {
            if (res) {
                productDetails = res[0]
                console.log(res)
                if (productDetails) {
                    for (let key in formData) {
                        formData[key] = productDetails[key]
                    }
                }
            }
        })
    }
}

function saveProduct() {


}

function resetForm() {
    enteredProductId.value = null
    for (let key in formData) {
        formData[key] = null
    }
} 

function confirmDelete() {

    state.confirmDeleteModal.showModal()

}
function deleteProduct() {

    if (enteredProductId) {
        productStore.deleteById(enteredProductId)
    }
}
</script>