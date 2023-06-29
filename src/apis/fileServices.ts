import { ref, uploadBytes } from 'firebase/storage' 
import { storage } from '@/apis/firebase'


export async function uploadFile(fileName: string, subfolder: string, file: File) {

    const filePath = `/${subfolder}/${fileName}`
    const storageRef = ref(storage,filePath)

    const snapshot = await uploadBytes(storageRef, file).catch(err => console.error(err))
    if (snapshot) {
        return snapshot.metadata.fullPath
    }
}

export function getPhotoUrl(fileName: string) {
    const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
    const encodedFileName = encodeURIComponent(fileName)
    const urlSuffix = '?alt=media'
    return `${urlRoot}${encodedFileName}${urlSuffix}`
}
// export async function getUrl(fileName: string, subfolder: string) {
//     const filePath = `/${subfolder}/${fileName}`
//     const storageRef = ref(storage, filePath)
    
//     const snapshot = await getDownloadURL(storageRef).catch(err => console.error(err))
//     if (snapshot) {
//         console.log(snapshot)
//         return snapshot
//     }
// }