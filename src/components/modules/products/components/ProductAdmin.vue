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
            <input name="genus" class="form-control" type="text"  v-model="formData.genus">
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
        <div class="col-auto mb-3 align-items-center d-flex flex-row">
            <div class="me-2">
                <input name="forSale" class="form-check-input" type="checkbox" v-model="formData.isForSale">
            </div>
            <div class="">
                <label for="forSale" class="form-check-label">Available for Sale</label>
            </div>
        </div>
        
    </div>
    <button type="button" class="btn btn-secondary">Reset Form</button>
    <button type="button" class="btn btn-primary">Save</button>
</form>

</template>

<script setup lang="ts">
//TODO further research FormKit library
import {ref, reactive } from 'vue'
import { useProductStore } from '../stores/product'
import { Product } from '@/components/modules/products/types/product'

const enteredProductId = ref(null)
// const genus = ref('')
// const productName = ref('')
// const propagationMethod = ref('')
// const source = ref('')
// const price = ref(0)
// const isForSale = ref(true)
// const quantity = ref(1)

const formData = reactive({
    id: null,
    genus: null,
    name: null,
    propagationMethod: null,
    source: null,
    price: null,
    isForSale: null,
    quantity: null,
})

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

function addProduct() {


}
</script>