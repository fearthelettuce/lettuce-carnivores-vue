import type {Product, PhotoItem} from '@/components/modules/products/types/product'
import type { Plant, PlantCategory } from '@/types/Plant'
import { deleteFile } from '@/apis/fileServices'

export const placeholderUrl = 'https://cdn-icons-png.flaticon.com/512/1033/1033018.png'

export function getPhotoUrl(fileName: string | null | undefined) {
    if(fileName === null || fileName === undefined) {return placeholderUrl}
    const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
    const encodedFileName = encodeURIComponent(fileName)
    const urlSuffix = '?alt=media'
    return `${urlRoot}${encodedFileName}${urlSuffix}`
}

export async function appendPhotoDataUtil(item: Product | Plant | PlantCategory, photoArr: Array<PhotoItem>) {
    if(!item || !photoArr) return
    if(item.photos) {
        item.photos = item.photos.concat(photoArr)
    } else {
        item.photos = photoArr
    }
}

export async function removePhotoUtil(item: Product | Plant | PlantCategory, photoToRemove: PhotoItem) {
    if(!item || !photoToRemove || !item.photos) return {success: false, error: true, message: 'Unable to find photo or product'}
    const photoIndex = item.photos.findIndex((ele: PhotoItem) => ele.path === photoToRemove.path)
    item.photos.splice(photoIndex, 1)
    if(item.id) {
        try {
            const res = await deleteFile(photoToRemove)
            return res
        } catch (err) {
            return {success: false, error: true, message: 'Something went wrong', errorDetails: err}
        }                
    } else {
        return {success: true, error: false, message: 'Photo removed'}
    }
}

export async function deleteAllPhotosUtil(product: Product) {
    product.photos.forEach(async (photo) => {
        await deleteFile(photo)
    })
}
