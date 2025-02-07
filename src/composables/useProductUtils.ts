import type { PlantCategory, Plant } from "@/types/Plant"
import type { Product } from "@/types/Product"
import { deleteAllPhotosUtil } from '@/composables/usePhotoUtils'
import { saveItem, findAll, deleteItem, findDocById } from '@/apis/dataServices'

export async function findProductById(id: number | string, collectionName: string) {
    const res = await findDocById(collectionName, id).catch(err => console.log(err))
    return res as Product
}
export async function getCategoryBySku(sku: string) {
    const categories = await findAll<PlantCategory>('plantCategories')
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

export async function saveProductUtil(product: Product | Plant, collectionName: string, productList: Array<Product>) {
    try {
        const res = await saveItem(collectionName, product)
        //TODO convert to toRaw
        if(res?.success) {
            const productDetails = JSON.parse(JSON.stringify( res?.documentDetails))
            const productIndex = productList?.findIndex(item => item.sku === productDetails.id)
            if (productList && productIndex !== null && productIndex !== undefined && productIndex > -1) {
                productList.splice(productIndex, 1, productDetails)
            } else {
                productList?.push(productDetails)
            }
            // if (this.searchFilters) {
            //     this.filterProducts()
            // }
            return { success: true, message: res.message }
        } else {
            return {success: false, error: true, errorDetails: res?.error, message: 'There was an error saving'}
        }
    } catch (err) {
        console.log(err)
        return {success: false, error: true, errorDetails: err, message: 'There was an error saving'}
    }
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
