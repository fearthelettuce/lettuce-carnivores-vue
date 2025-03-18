<template>
  <ProductAdminGrid />
</template>

<script setup lang="ts">
import { ref, type Ref} from 'vue';
import type { Product, Plant, ProductCategory } from '@/types/Product';
import ProductAdminGrid from '@/components/ProductAdminGrid.vue';

const productType = ref('plant')
const productData: Ref<Product[]> = ref([])
const now = new Date()
function addNewRow(quantity: number = 1) {
  productData.value.push({...newProduct})
}
const newProduct: Product = {
  sku: '',
  quantity: 1,
  productCategoryId: null,
  price: null,
  photos: [],
  status: 'active',
  createdDate: now,
  updatedDate: now,
  isDiscountable: true,
}
const defaultPlantData: Plant = {
  ...newProduct,
  size: null,
  additionalInformation: {
        propagationDate: '',
        shipping: '',
        ageGroup: '',
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