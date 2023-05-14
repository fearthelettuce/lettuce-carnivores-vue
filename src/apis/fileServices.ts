import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage' 
import { storage } from '@/apis/firebase'


export async function uploadFile(fileName: string, subfolder: string, file: File) {

    const filePath = `/${subfolder}/${fileName}`
    const storageRef = ref(storage,filePath)

    const snapshot = await uploadBytes(storageRef, file).catch(err => console.error(err))
    if (snapshot) {
        return snapshot.metadata.fullPath
    }
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