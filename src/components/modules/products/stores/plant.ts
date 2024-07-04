import { ref, type Ref } from "vue"
import { defineStore } from "pinia"
import { type PlantCategory,  type Plant} from "@/types/Plant"
import { type PhotoItem } from "../types/product"
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
export const usePlantStore = defineStore('plant', () => {

    const isLoading = ref(false)
    const plantCategories: Ref<PlantCategory[]> = ref([])
    
    const newPlantCategory = {
        name: '',
        genus: '',
        clone: '',
        description: '',
        id: undefined,
        plants: [] as Plant[],
        status: '',
        referencePhotos: [] as PhotoItem[]
    }

    const plantCategoryToEdit: Ref<PlantCategory | null> = ref(null)

    const setCategoryToEdit = (plantCategory: PlantCategory | null) => {
        if(plantCategory) {
            plantCategoryToEdit.value = plantCategory
        } else { 
            plantCategoryToEdit.value = {...newPlantCategory};
        }
    }

    const saveCategory = async (plantCategory: PlantCategory) => {
        if(plantCategoryToEdit === null) { return false}
        isLoading.value = true
        try {
            return saveItem('plantCategories',plantCategory)
        } catch(e: any) {
            throw new Error(e.toString())
        } finally {
            isLoading.value = false
        }
    }

    const findCategoryById = async (id: number) => {
        isLoading.value = true
        try{
            const res: unknown = findDocById('plantCategories', id)
            return res as unknown as PlantCategory
        } catch (e: any) {
            throw new Error(e.toString())
        } finally {
            isLoading.value = false
        }
    }
    const fetchAllCategories = async () => {
        isLoading.value = true
        try{
            return findAll('plantCategories')
        } catch (e: any) {
            throw new Error(e.toString())
        } finally {
            isLoading.value = false
        }
    }

    const fetchSearchResults = async () => {
        isLoading.value = true
        await fetchAllCategories()
        await filterCategories()
        isLoading.value = true
    }

    const categoryFilters = ref({
        inStock: true,
        genus: ['Heliamphora', 'Nepenthes', 'Cephalotus'],
    })

    async function filterCategories() {

    }

    return { isLoading, plantCategories, plantCategoryToEdit, setCategoryToEdit, saveCategory, fetchAllCategories}
})