<template>
    <BaseContainer>
        <div class="admin-grid">
            <div class="">
                <div class="my-4 g-3 align-items-center">
                    <div class="col-auto">
                        <div class="form-floating">
                            <select 
                                name="editProduct" 
                                it="editProduct"
                                class="form-select" 
                                aria-label="Select a product to edit" 
                                @change="setSelectedProduct" 
                                :value="productToEdit.id">
                                <option :value="undefined" style="color: lightsalmon;">Create New Product</option>
                                <option v-for="product of products" :value="product.id" :key="product.id" >{{ product.name }} ({{ product.id }})</option>
                            </select>
                            <label for="editProduct">Select a product to edit</label>
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="">
                        <ProductAdminForm />
                    </div>
                </div>
            </div>
            <div class="">
                <ProductCard 
                :product="productToEdit"
                />
            </div>
        </div>
        <div>
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
import { storeToRefs } from 'pinia'

const productStore = useProductStore()

const { getFilteredProducts: products } = storeToRefs(productStore)
const { getProductToEdit: productToEdit } = storeToRefs(productStore)
onMounted(() => {
    if (!productStore.productList || productStore.productList.length === 0) {
        productStore.fetchSearchResults()
    }
})

function setSelectedProduct(event: Event) {
    let product
    let productId = (event.target as HTMLInputElement).value
    if(!productId) {
        productStore.setProductToEdit(null);
    }
    if(event && event.target && productId && productStore.getProductById) {
        product = productStore.getProductById(Number(productId))
    }
    if(product) {
        productStore.setProductToEdit(product)
    }
}
</script>

<style scoped>
.admin-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media(min-width: 60rem) {
    .admin-grid {
        grid-template-columns: 70% 30%;
    }
}

</style>