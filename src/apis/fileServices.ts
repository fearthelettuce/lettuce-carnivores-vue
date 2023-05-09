import { getStorage, ref, uploadBytes } from 'firebase/storage' 
import { storage } from '@/apis/firebase'

const storageRef = ref(storage)

export async function uploadFile(fileName: string, child: string, file: File) {
    const storageRef = ref(storage, child)
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob!!!')
        console.log(snapshot)
    })

}

