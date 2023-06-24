<template>
    <div class="container">
        <div class="row">
            <div class="col-auto">
                <div class="row my-4 g-3 align-items-center">
                    <div class="col-auto">
                        <select 
                            name="editProduct" 
                            class="form-select" 
                            aria-label="Select a product to edit" 
                            @change="setSelectedProduct" 
                            :value="productStore.getProductToEdit.id">
                            <option id="placeholder" selected disabled value="">Select a product to edit</option>
                            <option v-for="product of products" :value="product.id" >{{ product.name }} ({{ product.id }})</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                        <ProductAdminForm />
                    </div>
                </div>
            </div>
            <div class="col-3">
                <ProductCard :product="productStore.getProductToEdit"/>
            </div>
        </div>
    </div>

    <hr class="mt-5"/>

    <ProductPhotoList :product="productStore.getProductToEdit"/>

    

</template>

<script setup lang="ts">
import { reactive, onMounted} from 'vue'
import { Modal } from 'bootstrap'
import { useProductStore } from '../stores/product'
import ProductAdminForm from './ProductAdminForm.vue'
import ProductPhotoList from './photos/ProductPhotoList.vue'
import ProductCard from './ProductCard.vue'
import PhotoUpload from '@/components/app/UI/PhotoUpload.vue'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { getFilteredProducts: products } = storeToRefs(productStore)
const state = reactive({
    // isSaved: false,
    // plant: null,
    confirmDeleteModal: null,
    successMessageToast: null,
    successMessage: null,
    isEditMode: false,
})

onMounted(() => {
    state.confirmDeleteModal = new Modal('#confirmDeleteModal', {})
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})

function setSelectedProduct(event: Event) {
    let product
    let productId = (event.target as HTMLInputElement).value
    if(event && event.target && productId && productStore.getProductById) {
        product = productStore.getProductById(Number(productId))
    }
    if(product) {
        productStore.setProductToEdit(product)
    }
}

</script>

<style scoped>

</style>