<template>
    <form class="container" @submit.prevent>
        <div class="align-items-center">
            <h3 v-if="product?.id">Edit Existing Product</h3>
            <h3 v-else>Creating a New Product</h3>
        </div>
        <div class="form-grid">
            <div class="form-floating">
                <input name="id" class="form-control" type="id" v-model="product.id" placeholder="ID">
                <label for="id">ID</label>
            </div>
            <div class="form-floating grid-item-lg">
                <input name="name" 
                    class="form-control" 
                    type="text" 
                    v-model="product.name" 
                    placeholder="Name"
                    @change="updateGenus">
                <label for="name" class="">Name</label>
            </div>
            <div class="form-floating">
                <input name="source" class="form-control" type="text" v-model="product.source" placeholder="Source">
                <label for="source">Source</label>
            </div>
            <div class="form-floating">
                <input name="clone" class="form-control" type="text" v-model="product.clone" placeholder="Clone">
                <label for="clone">Clone</label>
            </div>
            <div class="form-floating">
                <input name="propagationType" 
                    class="form-control" 
                    type="text" 
                    v-model="product.propagationMethod" 
                    placeholder="Propagation Method">
                <label for="propagationType">Propagation Method</label>
            </div>
            <div class="form-floating">
                <input name="propagaionDate" 
                    class="form-control" 
                    type="text" 
                    v-model.lazy="product.propagationDate" 
                    placeholder="Propagation Date"
                    @paste="pasteDate">
                <label for="propagaionDate">Propagation Date</label>
            </div>
            <div class="form-floating">
                <input name="size" class="form-control" type="text" v-model="product.size" placeholder="Size">
                <label for="size">Size</label>
            </div>

            <div class="form-floating">
                <input name="price" class="form-control" type="number" v-model.number="product.price" placeholder="Price">
                <label for="price">Price</label>
            </div>
            <div class="form-floating">
                <input name="quantity" class="form-control" type="number" v-model.number="product.quantity">
                <label for="quantity">Available Quantity</label>
            </div>
            <div class="pt-2 align-items-center form-check form-switch">
                    <label for="forSale" class="form-check-label">Available for Sale</label>
                    <input name="forSale" class="form-check-input" type="checkbox" v-model="product.isForSale">
            </div>
            <div class="form-floating grid-item-xl">
                <input name="description" class="form-control" type="text" v-model="product.description" placeholder="Description">
                <label for="description">Description</label>
            </div>
        </div>
        <div class="row justify-content-around d-flex flex-row mt-4">
            <button type="button" class="col-auto btn btn-danger mx-4" :class="!product.id && !product.name ? 'disabled' : ''" @click="confirmDelete">Delete Product</button>
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
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification' 
import { useProductStore } from '../stores/product'
import type { Plant } from '../types/plants'
import BaseModal from '@/components/app/UI/BaseModal.vue';


const productStore = useProductStore()
const toast = useToast()

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

function updateGenus () {
    let parsedGenus: string;
    const firstChar = product.value.name.charAt(0).toLowerCase();
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
    product.value.genus = parsedGenus ?? undefined;
    console.log(product.value.genus)
}

function resetForm() {
    console.log('calling resetForm in component')
    productStore.setProductToEdit(null)
    state.isSaved = false
    console.log(productStore.getProductToEdit)
}

async function saveProduct() {
    if (!validateProduct()) {
        toast.error('Invalid product, missing ID')
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

function pasteDate(event: ClipboardEvent) {
    console.log(product.value.propagationDate)
    const pastedData = event.clipboardData?.getData('text');
    const date = Date.parse(pastedData ?? "0")
    console.log(`date: ${date}`)
    if(date !==0) {console.log('poop'); product.value.propagationDate = new Date(date); console.log(product.value.propagationDate)}
    console.log(pastedData)
    console.log(new Date(date))
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
    grid-template-columns: repeat(8, 1fr);
    gap: .5rem;
    grid-auto-rows: minmax(4rem, auto);
}

.grid-item-sm {
    grid-column: span 1;
}

.grid-item-md {
    grid-column: span 2;
}

.grid-item-lg {
    grid-column: span 3;
}

.grid-item-xl {
    grid-column: span 4;
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