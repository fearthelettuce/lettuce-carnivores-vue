<template>

</template>

<script setup lang="ts">
import { ref } from 'vue';


import type { Product, Plant, ProductCategory } from '@/types/Product';
const productType = ref('plant')
const productData: Product[] = ref([])
const now = new Date()
function addNewRow(quantity: number = 1) {
  productData.value.push({...newProduct})
}
const newProduct: Product = {
  sku: '',
  quantity: 1,
  productCategoryId: null,
  productCategoryData: null,
  size: '',
  price: null,
  photos: [],
  status: '',
  createdDate: now,
  updatedDate: now,
  isDiscountable: true,
}
const defaultPlantData: Plant = {
  ...newProduct,
  additionalInformation: {
        propagationDate: '',
        shipping: null,
        ageGroup: null,
        isSpecimen: false,
        shelfLocation: '',
    }
}


const columns = {

}
//getAllProducts
//getAllProductCategories
//batch writes https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes

</script>