import { ref, type Ref } from "vue"
import { defineStore } from "pinia"
import { type PlantCategory,  type Plant} from "@/types/Plant"
import { type PhotoItem } from "../types/product"
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
export const usePlantStore = defineStore('plant', () => {

    const isLoading = ref(false)
    const collectionName = 'plantCategories' as const
    const plantCategories: Ref<PlantCategory[]> = ref([])
    
    const newPlantCategory = {
        id: '',
        name: '',
        genus: '',
        clone: '',
        description: '',
        plants: [] as Plant[],
        status: '',
        referencePhotos: [] as PhotoItem[]
    }

    const plantCategoryToEdit: Ref<PlantCategory> = ref({...newPlantCategory})

    const setCategoryToEdit = (plantCategory: PlantCategory | null) => {
        if(plantCategory) {
            plantCategoryToEdit.value = plantCategory
        } else { 
            plantCategoryToEdit.value = {...newPlantCategory};
            plantCategoryToEdit.value.id = ''
        }
    }

    const saveCategory = async (plantCategory: PlantCategory) => {
        if(plantCategoryToEdit === null) { return false}
        isLoading.value = true
        try {
            return saveItem(collectionName,plantCategory)
        } catch(e: any) {
            throw new Error(e.toString())
        } finally {
            isLoading.value = false
        }
    }

    const findPlantCategoryById = async (id: number|string) => {
        isLoading.value = true
        try{
            const res: unknown = await findDocById(collectionName, id)
            console.log(res)
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
            const categories = await findAll(collectionName)
            if(categories !== undefined && categories.length !== 0) {
                plantCategories.value = categories as PlantCategory[]
            }
            
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

    return { isLoading, plantCategories, newPlantCategory, plantCategoryToEdit, setCategoryToEdit, saveCategory, findPlantCategoryById, fetchAllCategories}
})