import { getStorage, ref, uploadBytes } from 'firebase/storage' 
import { storage } from '@/apis/firebase'


export async function uploadFile(fileName: string, subfolder: string, file: File) {

    const filePath = `/${subfolder}/${fileName}`
    const storageRef = ref(storage,filePath)

    const snapshot = await uploadBytes(storageRef, file).catch(err => console.error(err))
    if (snapshot) {
        return snapshot.metadata.fullPath
    }
}