import type { PlantCategory, Plant } from "@/types/Plant"
import type { Product, ProductCategory } from "@/types/Product"
import { deleteAllPhotosUtil } from '@/composables/usePhotoUtils'
import { findAll, deleteItem, findDocById } from '@/apis/dataServices'

export async function findProductById(id: number | string, collectionName: string) {
    const res = await findDocById(collectionName, id).catch(err => console.log(err))
    return res as Product
}
export async function getCategoryBySku(sku: string) {
    const categories = await findAll<PlantCategory>('plantCategories')
    if (Array.isArray(categories) === false) return;
    let categoryId: string | undefined = undefined
    for(let category of categories) {
        const plantSkus = category.plants.map(plant => plant.sku)
        if(plantSkus.includes(sku)) {
            categoryId = category.id
            break
        }
    }
    return categoryId
}

export async function deleteById(id: number | string, collectionName: string, collectionList: Array<any>) {
    deleteAllPhotosUtil(await findProductById(id, collectionName))
    const res = await deleteItem(collectionName, id).catch(err => {
        console.log(err)
        return { success: false, error: true, response: err, message: 'Unable to delete' }
    })
    if(res.error) {
        return { success: false, error: true, response: res.error, message: 'Unable to delete' }
    }
    const productIndex = collectionList?.findIndex(item => item.id === id)
    if (collectionList && productIndex && productIndex > -1) {
        collectionList?.splice(productIndex, 1)
    }

    return { success: true, error: false, response: res, message: 'Deleted' }
}

export const newProductCategory: Partial<ProductCategory> = {
    category: '',
    subCategory: '',
    name: '',
    description: '',
    status: 'active',
    photos: [],
    tags: [],
    createdDate: new Date(),
    dateUpdated: new Date(),
}

export const newProduct: Partial<Product> = {
    quantity: 1,
    productCategoryId: null,
    price: null,
    status: 'active',
    photos: [],
    createdDate: new Date(),
    updatedDate: new Date(),
}