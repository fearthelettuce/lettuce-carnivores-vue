import { ref, watch, type Ref } from "vue"
import { defineStore } from "pinia"
import type { PlantCategory, Plant} from "@/types/Plant"
import { type PhotoItem } from "../../../../types/Product"
import { saveItem, findAll, findDocById } from '@/apis/dataServices'
import {deleteById} from '@/composables/useProductUtils'
import {appendPhotoDataUtil, removePhotoUtil} from '@/composables/usePhotoUtils'
import { newPlantCategory, newPlant, defaultFilters } from "@/constants/constants"
import { toast } from 'vue3-toastify'
export const usePlantStore = defineStore('plant', () => {

    const isLoading = ref(false)
    const collectionName = 'plantCategories' as const

    const plantCategories: Ref<PlantCategory[]> = ref([])
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
            sortCategoriesById()
        } catch (e: any) {
            throw new Error(e.toString())
        } finally {
            isLoading.value = false
        }
    }

    function sortCategoriesById(prop: keyof PlantCategory = 'id') {
        plantCategories.value.sort((a, b) => { return parseInt(a.id) - parseInt(b.id) })
    }

    const filteredCategories: Ref<PlantCategory[]> = ref([])

    const updateFilteredCategories = () => {
        filteredCategories.value = getAvailableCategories()
    }
    const productFilters = ref({...defaultFilters})
    watch(
        () => productFilters.value,
        () => {
            if(plantCategories.value.length === 0) { return }
            updateFilteredCategories()
        }, 
        { deep: true }
    )
    const getAvailableCategories = () => {
        const selectedOther = productFilters.value.other.items.map(item => item.value)
        const selectedExperience = productFilters.value.experience.items
        return plantCategories.value.filter(category => {
            const plants = getAvailablePlants(category)
            return plants.length > 0 && 
            !['Hidden', 'Archived', 'Sold'].includes(category.status) &&
            productFilters.value.genus.items.includes(category.genus) &&
            selectedOther.includes(category.speciesHybrid) &&
            productFilters.value.experience.items.includes(category.experience)
        })
    }
    const getAvailablePlants = (category: PlantCategory | undefined) => {
        if(category === undefined) {return []}
        const selectedStatuses = productFilters.value.status.items.map(status => status.value)
        const selectedOther = productFilters.value.other.items.map(item => item.value)
        const visiblePlants = category.plants.filter(plant => 
            plant.quantity > 0 &&
            plant.status !== 'Hidden' &&
            plant.status !== 'Archived' &&
            plant.status !== 'Sold' &&
            plant.price > 0
        )

        let filteredPlants
        filteredPlants = visiblePlants.filter(plant => selectedStatuses.includes(plant.status))
        filteredPlants = filteredPlants.filter(plant => selectedOther.includes('Specimen') ? true : plant.isRepresentative )
        filteredPlants = filteredPlants.filter(plant => selectedOther.includes('Representative') ? true : !plant.isRepresentative)
        return filteredPlants
    }

    const addPlant = (plantCategory: PlantCategory) => {
        if(plantCategory.plants.length === 0) {
            const defaultPlant = {...newPlant}
            defaultPlant.plantCategoryId = plantCategory.id
            defaultPlant.status = 'Coming Soon'
            plantCategory?.plants.push({...defaultPlant})
        } else {
            const lastPlant = plantCategory.plants[plantCategory.plants.length - 1]
            const nextId = lastPlant.id !== '' ? parseInt(lastPlant.id.toString()) + 1 : ''
            plantCategory?.plants.push({
                id: nextId.toString(),
                sku: nextId.toString(),
                isRepresentative: lastPlant.isRepresentative,
                size: '',
                propagationDate: new Date().toString(),
                status: 'In Stock',
                price: lastPlant.price,
                discountedPrice: lastPlant.discountedPrice,
                isDiscounted: lastPlant.isDiscounted,
                quantity: 1,
                photos: [],
                plantCategoryId: plantCategory.id
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
    async function getCategoryByPlant(plant: Plant) {
        if(plantCategories.value.length === 0) {
            fetchAllCategories()
        }
        return plantCategories.value.find(category => category.id === plant.plantCategoryId)
    }
    return { 
        isLoading,
        isSaving,
        plantCategories, 
        plantCategoryToEdit,
        setCategoryToEdit,
        saveCategory,
        deleteCategoryById,
        findPlantCategoryById, 
        fetchAllCategories,
        addPlant,
        removePlant,
        appendPhotoData,
        removePhoto,
        getAvailablePlants,
        getAvailableCategories,
        productFilters,
        updateFilteredCategories,
        filteredCategories,
    }
})