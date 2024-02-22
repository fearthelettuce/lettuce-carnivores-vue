import type {Product, PhotoItem} from '@/components/modules/products/types/product'
import type {Specimen} from '@/components/modules/products/types/plants.ts'
import { deleteFile } from '@/apis/fileServices'

export const placeholderUrl = 'https://cdn-icons-png.flaticon.com/512/1033/1033018.png'

export function getPhotoUrl(fileName: string | null | undefined) {
    if(fileName === null || fileName === undefined) {return placeholderUrl}
    const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
    const encodedFileName = encodeURIComponent(fileName)
    const urlSuffix = '?alt=media'
    return `${urlRoot}${encodedFileName}${urlSuffix}`
}

export async function appendPhotoDataUtil(product: Product | Specimen, photoArr: Array<PhotoItem>) {
    if(!product || !photoArr) return
    if(product.photos) {
        product.photos = product.photos.concat(photoArr)
    } else {
        product.photos = photoArr
    }
}

export async function removePhotoUtil(product: Product | Specimen, photoToRemove: PhotoItem) {

    if(!product || !photoToRemove || !product.photos) return {success: false, error: true, message: 'Unable to find photo or product'}
    const photoIndex = product.photos.findIndex((ele) => ele.path === photoToRemove.path)
    console.log(photoIndex)
    product.photos.splice(photoIndex, 1)
    console.log(product.photos)
    if(product.id) {
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

