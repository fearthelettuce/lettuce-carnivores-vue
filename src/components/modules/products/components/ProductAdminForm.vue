<template>
    <form class="container" @submit.prevent>
        <div class="align-items-center">
            <h3 v-if="product?.id">Edit Existing Product</h3>
            <h3 v-else>Creating a New Product</h3>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1 mb-3">
                <label for="id" class="form-label">ID</label>
                <input name="id" class="form-control" type="id" v-model="product.id">
            </div>
            <div class="col-3 mb-3">
                <label for="genus" class="form-label">Genus</label>
                <select name="genus" class="form-select" aria-label="Select Genus" v-model="product.genus">
                    <option id="placeholder" selected disabled value="">Select Genus</option>
                    <option v-for="genus of productStore.genusList" :value="genus" :key="genus.id">{{ genus.label }}</option>
                </select>
            </div>
            <div class="col-6 mb-3">
                <label for="name" class="form-label">Name</label>
                <input name="name" class="form-control" type="text" v-model="product.name">
            </div>
        
        </div>
        <div class="row">
            <div class="col-3 mb-3">
                <label for="propagationType" class="form-label">Propagation Method</label>
                <input name="propagationType" class="form-control" type="text" v-model="product.propagationMethod">
            </div>
            <div class="col-3 mb-3">
                <label for="source" class="form-label">Source</label>
                <input name="source" class="form-control" type="text" v-model="product.source">
            </div>
            <div class="col-2 mb-3">
                <label for="price" class="form-label">Price</label>
                <input name="price" class="form-control" type="number" v-model.number="product.price">
            </div>
            <div class="col-2 mb-3">
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
            <button type="button" class="col-auto btn btn-danger mx-4" :class="!product.id ? 'disabled' : ''" @click="confirmDelete">Delete Product</button>
            <button type="button" class="col-auto btn btn-secondary mx-4" @click="resetForm">Reset Form</button>
            <button type="button" class="col-auto px-4 btn btn-primary mx-4" @click="saveProduct">Save</button>
            <button type="button" class="col-auto btn btn-primary mx-4" @click="saveAndNew">Save & New</button>
        </div>

        
    </form>
    
    <BaseModal ref="confirmDeleteModalRef">
        <template #title>Are you sure?</template>
            <template #body>
                <div>Are you sure you want to delete this product?<br><br> {{ product.name }}({{ product.id }})</div>
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
import { computed, ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification' 
import { useProductStore } from '../stores/product'
import type { Plant } from '../types/plants'
import BaseModal from '@/components/app/UI/BaseModal.vue';

//TODO: Add fields for all values:
// clone: '',
//     propagationMethod: '',
//     source: '',
//     size: '',
//     description: '',


const productStore = useProductStore()
const toast = useToast()

const { getProductToEdit: product } = storeToRefs(productStore)

const state = reactive({
    isSaved: false,
    successMessage: null,
    isEditMode: false,
})

const confirmDeleteModalRef = ref<InstanceType<typeof BaseModal> | null>(null)

onMounted(() => {
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})

const getGenus = computed(()=>{
    const firstChar = product.value.name.charAt(0).toLowerCase();
    switch (firstChar) {
        case '':
            return undefined;
        case 'c':
            return 'Cephalotus';
        case 'd':
            return 'Drosera';
        case 'h':
            return 'Heliamphora';
        case 'n':
            return 'Nepenthes';
        case 'p':
            return 'Pinguicula';
    }
})

function resetForm() {
    productStore.setProductToEdit(null)
    state.isSaved = false
}

async function saveProduct() {
    if (!validateProduct()) {
        alert("Failed validation, bro")
        return
    }
    const res = await productStore.saveProduct(product.value as Plant).catch(err => console.error(err))
    if (res && res.success && res.message) {
        toast.success(res.message)
        state.isSaved = true
    } else {
        console.log(res)
        if (res && res.message) {
            console.log(res)
            toast.error(res.message)
            state.isSaved = false
        }
    }
}

function confirmDelete() {
    confirmDeleteModalRef.value?.showModal()
}

async function deleteProduct() {
    if (product.value.id) {
        const productId = product.value.id
        const res = await productStore.deleteById(product.value.id).catch(err => console.error(err))
        if (res && res.success) {
            toast.success(`Product ${productId} deleted`)
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
    await saveProduct()
    resetForm()
}

function validateProduct() {
    //TODO: Need to add validation
    return true
}

</script>


<style scoped>
input::-webkit-inner-spin-button {
    -webkit-appearance: none
}
</style>