import { ref, watch, type Ref } from "vue"
import { defineStore } from "pinia"
import type { PlantCategory, Plant} from "@/types/Plant"
import type { Product, PhotoItem } from "@/types/Product"
import { saveItem, findAll, findDocById } from '@/apis/dataServices'

export const useProductStore = defineStore('product', () => {

    const isLoading = ref(false)
    const products: Ref<Product[]> = ref([])

    return {products, isLoading} 
})