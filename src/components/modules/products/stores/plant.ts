import { ref, type Ref } from "vue"
import { defineStore } from "pinia"
import { type PlantCategory,  type Plant} from "@/types/Plant"
import { type PhotoItem } from "../types/product"
import { saveItem, findAll, findByProperty, findDocById } from '@/apis/dataServices'
import {deleteById, saveProductUtil} from '@/composables/useProductUtils'
import {appendPhotoDataUtil, removePhotoUtil} from '@/composables/usePhotoUtils'
export const usePlantStore = defineStore('plant', () => {

    const isLoading = ref(false)
    const collectionName = 'plantCategories' as const
    const genusList = ['Heliamphora', 'Nepenthes', 'Cephalotus', 'Other']
    const statusList = ['For Sale', 'Coming Soon', 'Archived', 'Hidden']
    const plantCategories: Ref<PlantCategory[]> = ref([])
    
    const newPlantCategory = {
        id: '',
        name: '',
        genus: '',
        clone: '',
        description: '',
        plants: [] as Plant[],
        status: '',
        photos: [] as PhotoItem[]
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
    const isSaving = ref(false)
    const saveCategory = async (plantCategory: PlantCategory) => {
        if(plantCategoryToEdit === null) { return false}
        isSaving.value = true
        try {
            return saveItem(collectionName,plantCategory)
        } catch(e: any) {
            throw new Error(e.toString())
        } finally {
            isSaving.value = false
        }
    }

    const deleteCategoryById = async (id: number | string) => { 
        //TODO add logic to check if any active plants
        const res = deleteById(id, collectionName, plantCategories.value)
        if (plantCategoryToEdit.value.id === id) {
            setCategoryToEdit(null)
        }
        return res
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

    // const fetchSearchResults = async () => {
    //     isLoading.value = true
    //     await fetchAllCategories()
    //     await filterCategories()
    //     isLoading.value = true
    // }

    const categoryFilters = ref({
        inStock: true,
        genus: genusList,
        status: statusList.filter(item => item !== 'Hidden')
    })

    async function filterCategories() {

    }


    const addPlant = (plantCategory: PlantCategory) => {
        plantCategory?.plants.push({
            id: '',
            sku: '',
            isRepresentative: false,
            size: undefined,
            propagationDate: new Date(),
            status: 'Coming Soon',
            price: 0,
            discountedPrice: 0,
            isDiscounted: false,
            quantity: 1,
            photos: [],

        })
    }





     const appendPhotoData = async(plantCategory: PlantCategory, photoArr: Array<PhotoItem>) => {
        const res = appendPhotoDataUtil(plantCategory, photoArr)
        if (plantCategory.id) {
            saveCategory(plantCategory)
        }
        return res
    }
    const removePhoto = async (plantCategory: PlantCategory, photoToRemove: PhotoItem) => {
        const res = removePhotoUtil(plantCategory, photoToRemove)
        if(plantCategory.id) {
            saveCategory(plantCategory)
        }
        return res
    }


    return { 
        isLoading,
        genusList,
        statusList,
        plantCategories, 
        newPlantCategory,
        plantCategoryToEdit,
        setCategoryToEdit,
        saveCategory,
        isSaving,
        addPlant,
        findPlantCategoryById, 
        fetchAllCategories, 
        deleteCategoryById,
        appendPhotoData,
        removePhoto,
    }
})