<template>
    <BaseContainer> 
        <!-- TODO remove x padding/margin at small screen sizes -->
        <!-- <div class="row justify-content-around d-flex flex-row"> -->
        <div class="admin-grid">
            <section>
                <div class="grid-item-xl">
                    <div class="form-floating mb-4">
                        <ItemSelect :options="products" v-model="productToEdit" label="Product" :include-create="true"/>
                        <label for="editProduct">Select a product to edit</label>
                    </div>
                    <button @click.prevent="createNewProduct">Create New Product</button>
                </div>
                <ProductAdminForm />
            </section>

            <ProductCard :product="productToEdit" />
        </div>
        <div class="grid-item-xl">
            <hr class="mt-5"/>
            <ProductPhotoList
            :product="productToEdit" />
        </div>
    </BaseContainer>
</template>

<script setup lang="ts">
import { onMounted} from 'vue'
import { useProductStore } from '../stores/product'
import ProductAdminForm from './ProductAdminForm.vue'
import ProductPhotoList from './photos/ProductPhotoList.vue'
import ProductCard from './ProductCard.vue'
import ItemSelect from '@/components/app/admin/ItemSelect.vue'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()

const { getFilteredProducts: products } = storeToRefs(productStore)
const { productToEdit } = storeToRefs(useProductStore())
onMounted(() => {
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})

const createNewProduct = ()=>{
    productStore.setProductToEdit(null)
}

</script>

<style scoped>
.admin-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

.grid-item-xl {
    grid-column: 1 / -1
}

@media(min-width: 60rem) {
    .admin-grid {
        grid-template-columns: 70% 30%;
    }
}

</style>