import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage' 
import { storage } from '@/apis/firebase'
import type { PhotoItem } from '@/types/Product'

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
        return {success: true, error: false, message: 'Deleted'}
    } catch (e) {
        console.log(e);
        return {success: false, error: true, message: 'Error deleting file from Firebase Storage', errorDetails: e}
    }
}

export async function deletePhoto(photoPath: string) {
    const storageRef = ref(storage, photoPath)
    if(!storageRef) {return {success: false, error: false, message: `Photo path ${photoPath} does not exist in Firebase`}}
    try {
        await deleteObject(storageRef)
        return {success: true, error: false, message: 'Deleted'}
    } catch (e) {
        console.log(e);
        return {success: false, error: true, message: 'Error deleting file from Firebase Storage', errorDetails: e}
    }
}

// not used - this was an attempt to get photos to work in Stripe but did not succeed.  Leaving this here in case a use case comes up. Have fun deleting in 3 years. 7/26/24
// export async function getPhotoDownloadUrl(photo: PhotoItem) {

//     const photoUrl = `https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/referencePhotos/IMG20240719094313.jpg`
//     const storageRef = ref(storage, photoUrl)
//     if(!storageRef) {return {success: false, error: false, message: `Photo path ${photo.path} does not exist in Firebase`}}
//     try {
//         const url = await getDownloadURL(storageRef)
//         return url
//     } catch (e: any) {
//         console.log(e);
//         return {success: false, error: true, message: 'Error getting download url from Firebase Storage', errorDetails: e}
//     }
// }