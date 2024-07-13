<template>
    <form @submit.prevent>
        <div class="align-items-center">
            <h3 v-if="product?.id">Edit Existing Product</h3>
            <h3 v-else>Creating a New Product</h3>
        </div>
        <div class="form-grid">
            <div class="form-floating grid-item-lg">
                <input name="name" 
                class="form-control" 
                type="text" 
                v-model="product.name" 
                placeholder="Name">
                <label for="name" class="">Name</label>
            </div>
            <div class="form-floating">
                <input name="id" class="form-control" type="id" v-model="product.id" placeholder="ID" required>
                <label for="id">ID</label>
            </div>
            <div class="form-floating">
                <input name="price" class="form-control" type="number" v-model.number="product.price" placeholder="Price">
                <label for="price">Price</label>
            </div>
            <div class="form-floating">
                <input name="quantity" class="form-control" type="number" v-model.number="product.quantity">
                <label for="quantity">Quantity</label>
            </div>
            <div class="align-items-center form-check form-switch grid-item-md">
                    <label for="forSale" class="form-check-label">For Sale</label>
                    <input name="forSale" class="form-check-input" type="checkbox" v-model="product.isForSale">
            </div>
            <div class="form-floating grid-item-xl grid-item-two-rows">
                <textarea name="description" 
                class="form-control" 
                style="height: 10rem;"
                v-model="product.description" 
                placeholder="Description"></textarea>
                <label for="description">Description</label>
            </div>
        </div>
        <div class="action-grid">
            <button type="button" class="btn btn-danger" :class="!product.id && !product.name ? 'disabled' : ''" @click="confirmDelete">Delete Product</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">Reset Form</button>
            <button type="button" class="btn btn-primary" @click="saveProduct">Save</button>
            <button type="button" class="btn btn-primary" @click="saveAndNew">Save & New</button>
        </div>

        <datalist id="sizeList">
            <option v-for="item of productStore.getSizeList" :key="item">{{ item }}</option>
        </datalist>
        <datalist id="sourceList">
            <option v-for="item of productStore.sourceList" :key="item">{{ item }}</option>
        </datalist>
        <datalist id="propagationMethodList">
            <option v-for="item of productStore.getPropagationMethodList" :key="item">{{ item }}</option>
        </datalist>
        
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
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import { useProductStore } from '../stores/product'
import type { Product } from '../../../../types/Product'
import BaseModal from '@/components/app/UI/BaseModal.vue';

const productStore = useProductStore()

const { getProductToEdit: product } = storeToRefs(productStore)

const state = reactive({
    isSaved: false,
    successMessage: String,
    isEditMode: false,
})

const confirmDeleteModalRef = ref<InstanceType<typeof BaseModal> | null>(null)

onMounted(() => {
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
    
})

function resetForm() {
    productStore.setProductToEdit(null)
    state.isSaved = false
}

async function saveProduct() {
    if (!validateProduct()) {
        toast.error('Invalid product, missing ID')
        return
    }
    const res = await productStore.saveProduct(product.value as Product).catch(err => console.error(err))
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

async function deleteProduct() {
    if (product.value.id) {
        const res = await productStore.deleteById(product.value.id).catch(err => console.error(err))
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
    await saveProduct()
    resetForm()
}

function validateProduct() {
    //TODO: Need to add validation
    //must have ID to save
    if(product.value.id) {return true}
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