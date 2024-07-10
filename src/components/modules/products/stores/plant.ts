import { ref, type Ref } from "vue"
import { defineStore } from "pinia"
import { type PlantCategory,  type Plant} from "@/types/Plant"
import { type PhotoItem } from "../types/product"
import { saveItem, findAll, findByProperty, findDocById } from '@/apis/dataServices'
import {deleteById, saveProductUtil} from '@/composables/useProductUtils'
import {appendPhotoDataUtil, removePhotoUtil} from '@/composables/usePhotoUtils'
import { toast } from 'vue3-toastify'
export const usePlantStore = defineStore('plant', () => {

    const isLoading = ref(false)
    const collectionName = 'plantCategories' as const
    const genusList = ['Heliamphora', 'Nepenthes', 'Cephalotus', 'Other']
    const statusList = [{label:'', value: ''}, {label:'Available', value: 'Available'}, {label:'Coming Soon', value: 'Coming Soon'},{label:'Sold', value: 'Sold'}, {label:'Archived', value: 'Archived'}, {label:'Hidden', value: 'Hidden'}]
    const sizeList = [
        {label: '', value: '',},
        {label: '2.5"', value: '2,5"'},
        {label: '3" deep', value: '3" deep'},
        {label: '3.5"', value: '3,5"'},
        {label: '3.5" deep', value:'3.5" deep'},
        {label: '4" deep', value: '4" deep'},
        {label: 'Bare Root', value: 'Bare Root'}
    ]
    const plantCategories: Ref<PlantCategory[]> = ref([])
    
    const newPlantCategory = {
        id: '',
        name: '',
        genus: '',
        clone: '',
        description: '',
        plants: [] as Plant[],
        status: 'Available',
        photos: [] as PhotoItem[]
    }

    const plantCategoryToEdit: Ref<PlantCategory> = ref({...newPlantCategory})

    const setCategoryToEdit = (plantCategory: PlantCategory | null) => {
        if(plantCategory) {
            plantCategoryToEdit.value = plantCategory
        } else { 
            plantCategoryToEdit.value.plants.length = 0
            plantCategoryToEdit.value = {...newPlantCategory};
            plantCategoryToEdit.value.id = ''
        }
    }

    const isSaving: Ref<boolean> = ref(false)

    const saveCategory = async (plantCategory: PlantCategory) => {
        if(plantCategoryToEdit === null) { return false}
        isSaving.value = true
        console.log(isSaving.value)
        try {
            await saveItem(collectionName,plantCategory)
            toast.success('Saved')
        } catch(e: any) {
            throw new Error(e.toString())
        } finally {
            isSaving.value = false
            if(!plantCategories.value.some(plant => plantCategory.id === plant.id)) {
                plantCategories.value.push(plantCategory)
            }
        }
    }

    const deleteCategoryById = async (id: number | string) => {
        const res = deleteById(id, collectionName, plantCategories.value)
        if (plantCategoryToEdit.value.id === id) {
            setCategoryToEdit(null)
            plantCategoryToEdit.value.plants.length = 0
        }
        return res
    }

    const findPlantCategoryById = async (id: number|string) => {
        isLoading.value = true
        try{
            const res: unknown = await findDocById(collectionName, id)
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
    async function filterCategories() {

    }
    // const fetchSearchResults = async () => {
    //     isLoading.value = true
    //     await fetchAllCategories()
    //     await filterCategories()
    //     isLoading.value = true
    // }

    // const categoryFilters = ref({
    //     inStock: true,
    //     genus: genusList,
    //     status: statusList.filter(item => item !== 'Hidden')
    // })
    // const availablePlants: Ref<PlantCategory[]> = ref([])
    // const filteredCategories: Ref<PlantCategory[]> = ref([])

    // const getAvailablePlants = async () => {
    //     if(plantCategories.value.length === 0) {
    //         await fetchAllCategories()
    //     }
    //     categoriesWithAvailablePlants.value = plantCategories.value.plants.filter((plant) => {
    //     console.log(plant)
    //     console.log(plant.quantity > 0 && plant.status === 'Available' && plant.price !== 0)
    //     return plant.quantity > 0 && plant.status === 'Available' && plant.price !== 0})
    // }
    const getAvailableCategories = () => {
        return plantCategories.value.filter((category) => {
            return category.status === 'Available' && getAvailablePlants(category).length > 0
        })
    }
    const getAvailablePlants = (category: PlantCategory | undefined) => {
        if(category === undefined) {return []}
        return category.plants.filter((plant) => {
            return plant.quantity > 0 && plant.status === 'Available' && plant.price !== 0})
    } 



    const addPlant = (plantCategory: PlantCategory) => {
        if(plantCategory.plants.length === 0) {
            plantCategory?.plants.push({
                id: '',
                sku: '',
                isRepresentative: false,
                size: '',
                propagationDate: new Date(),
                status: 'Coming Soon',
                price: 0,
                discountedPrice: 0,
                isDiscounted: false,
                quantity: 1,
                photos: [],
    
            })
        } else {
            const lastPlant = plantCategory.plants[plantCategory.plants.length - 1]
            const nextId = lastPlant.id !== '' ? parseInt(lastPlant.id.toString()) + 1 : ''
            plantCategory?.plants.push({
                id: nextId,
                sku: nextId.toString(),
                isRepresentative: lastPlant.isRepresentative,
                size: '',
                propagationDate: new Date(),
                status: 'Available',
                price: lastPlant.price,
                discountedPrice: lastPlant.discountedPrice,
                isDiscounted: lastPlant.isDiscounted,
                quantity: 1,
                photos: [],
            })
        }
        
    }

    const removePlant = async(index: number) => {
        plantCategoryToEdit.value.plants.splice(index,1)
        await saveCategory(plantCategoryToEdit.value)
    }

    const appendPhotoData = async(plantCategory: PlantCategory, photoArr: Array<PhotoItem>) => {
        const res = appendPhotoDataUtil(plantCategory, photoArr)
        if (plantCategory.id) { saveCategory(plantCategory) }
        return res
    }

    const removePhoto = async (plantCategory: PlantCategory, photoToRemove: PhotoItem) => {
        const res = removePhotoUtil(plantCategory, photoToRemove)
        if(plantCategory.id) {saveCategory(plantCategory)}
        return res
    }

    return { 
        isLoading,
        genusList,
        statusList,
        sizeList,
        plantCategories, 
        newPlantCategory,
        plantCategoryToEdit,
        setCategoryToEdit,
        saveCategory,
        isSaving,
        addPlant,
        removePlant,
        findPlantCategoryById, 
        fetchAllCategories, 
        deleteCategoryById,
        appendPhotoData,
        removePhoto,
        getAvailablePlants,
        getAvailableCategories
    }
})