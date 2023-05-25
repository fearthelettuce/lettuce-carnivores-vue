import { collection, doc, getDoc, getDocs, query, where, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/apis/firebase'

export function parseJSON(jsonData: JSON) {
    let results
    try {
        const data = JSON.parse(JSON.stringify(jsonData))
        results = data;
    } catch (error) {
        console.log(error)
        return
    }
    return results
}

async function getNextSequentialId(collectionName: string, idFieldName: string) {
    const startingValue = 1000
    let docs: Array<unknown> | undefined = []
    try {
        docs = await findAll(collectionName)
    } catch (err) {
        console.log(err)
    }
    let nextSequentialId: any
    if (docs) {
        nextSequentialId = await docs.reduce((acc: Number, doc: any) => acc = acc > doc[idFieldName] ? acc : doc[idFieldName], startingValue).valueOf()
        nextSequentialId++ 
    } else {
        return startingValue + 1
    }
    return nextSequentialId
}

export async function saveItem(collectionName: string, obj: any) {
    if (obj == null || typeof obj !== 'object') {
        return {success: false, error:true, errorMessage: `Invalid object ${obj.toString()}`}
    }

    if (!obj.hasOwnProperty('id') || !obj.id) {
        let nextId: number = await getNextSequentialId(collectionName, 'id')
        obj.id = nextId
    } 
    console.log(obj)
    try {
        await setDoc(doc(db, collectionName, obj.id.toString()), { ...obj })
        return { success: true, error: false, message: 'Saved successfully', errorDetails: null, documentDetails: obj}
    } catch (err) {
        console.log(err)
        return { success: false, error: true, message: 'Unable to save', errorDetails: err, documentDetails: obj}
    }
}

export async function deleteItem(collectionName: string, id: number | string) {0
    try {
        await deleteDoc(doc(db, collectionName, id.toString()))
        return {success: true, error: false, message: null, errorDetails: null}
    } catch (err) {
        throw new Error('An error occurred when trying to delete')
    }
    
}

export async function findDocById(collectionName: string, id: number | string) {
    const docRef = doc(db, collectionName, id.toString())
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        return null
    }
}

export async function findByProperty(collectionName: string, property: string, value: any) {
    console.log(collectionName)
    const returnArr: Array<any> = []
    const q = query(collection(db, collectionName), where(property, "==", value))
    const querySnapshot = await getDocs(q)
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        returnArr.push(doc.data())
    })
    return returnArr
}

export async function findAll(collectionName: string) {
    let returnArr: Array<unknown> = []
    try {
        const querySnapshot = await getDocs(collection(db, collectionName))
        querySnapshot.forEach((doc) => {
            returnArr.push({ ...doc.data() })
        })
        return returnArr
    } catch (error) {
        console.log(error)
        return
    }
}
    
