import { ref, uploadBytes, deleteObject } from 'firebase/storage' 
import { storage } from '@/apis/firebase'
import type { PhotoItem } from '@/components/modules/products/types/product'

export function getPhotoUrl(fileName: string) {
    const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
    const encodedFileName = encodeURIComponent(fileName)
    const urlSuffix = '?alt=media'
    return `${urlRoot}${encodedFileName}${urlSuffix}`
}

export async function uploadFile(fileName: string, subfolder: string, file: File) {
    const filePath = `/${subfolder}/${fileName}`
    const storageRef = ref(storage,filePath)
    try {
        const res = await uploadBytes(storageRef, file)
        return {success: true, filePath: res.metadata.fullPath, message: 'Photo uploaded'};
    } catch (err) {
        console.error(err);
        return {success: false, error: true, message: 'Error uploading file', errorDetails: err}
    }
}

export async function deleteFile(photo: PhotoItem) {
    const storageRef = ref(storage, photo.path)
    console.log(storageRef)
    if(!storageRef) {return {success: false, error: false, message: `Photo path ${photo.path} does not exist in Firebase`}}
    try {
        await deleteObject(storageRef)
        return {success: true, error: false}
    } catch (err) {
        console.log(err);
        return {success: false, error: true, message: 'Error deleting file from Firebase Storage', errorDetails: err}
    }
}