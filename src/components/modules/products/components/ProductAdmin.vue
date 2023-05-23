<template>
    <div class="container">
        <div class="row">
            <div class="col-auto">
                <div class="row my-4 g-3 align-items-center">
                    <div class="col-auto">
                        <select name="editProduct" class="form-select" aria-label="Select a product to edit" @change="setSelectedProduct">
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
    <ProductPhotoList />

    

    <div class="toast-container position-absolute p-5 top-0 end-0">
            <BaseToast
            ref="successMessageToast"
            id="successMessageToast"
            type="success"
            >
                <template #toastBody>{{ state.successMessage }}</template>
            </BaseToast>
    </div>

</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import { Modal, Toast } from 'bootstrap'
import { useProductStore } from '../stores/product'
import ProductAdminForm from './ProductAdminForm.vue'
import ProductPhotoList from './ProductPhotoList.vue'
import ProductCard from './ProductCard.vue'
import PhotoUpload from '@/components/app/UI/PhotoUpload.vue'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { getFilteredProducts: products } = storeToRefs(productStore)
const state = reactive({
    isSaved: false,
    plant: null,
    confirmDeleteModal: null,
    successMessageToast: null,
    successMessage: null,
    isEditMode: false,
})

onMounted(() => {
    state.confirmDeleteModal = new Modal('#confirmDeleteModal', {})
    state.successMessageToast = new Toast('#successMessageToast')
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})

function setSelectedProduct(event) {
    const product = productStore.getProductById(event.target.value)
    productStore.setProductToEdit(product)
    productStore.findProductById(1001)
}

// function getProductDetails(event) {
//     const productId = event.target.value
//     if (productId) {
//         productStore.findProductById(productId).then((res) => {
//             if (res) {
//                 if (res.length === 0) {
//                     console.log(res)
//                     alert('Unable to find product with that ID')
//                 } else {
//                     if (res) {
//                         // for (let key in formData) {
//                         //     formData[key] = res[key]
//                         // }
//                         state.isSaved = true
//                         state.plant = res
//                     }
//                 }
//             }
//         })
//     }
// }


function showToastMessage(message) {
    state.successMessage = message
    state.successMessageToast.show()
}

</script>

<style scoped>

</style>