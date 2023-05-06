import { collection, doc, getDoc, getDocs, addDoc, query, where, deleteDoc, DocumentReference, setDoc } from 'firebase/firestore';
import { db } from '@/apis/firebase'
import type { UUID } from 'crypto';

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
    let objId
    if (obj !== null && typeof obj === 'object' && obj.hasOwnProperty('id')) {
        objId = obj['id']
    }
    if (objId === null) {
        let nextId: number = await getNextSequentialId(collectionName, 'id')
        obj.id = nextId
        console.log(obj)
    }


    try {
        const res = await setDoc(doc(db, 'products', obj.id.toString()), { ...obj })
        return { success: true, error: false, message: null, errorDetails: null, documentDetails: obj}
    } catch (err) {
        console.log(err)
        return {success: false, error: true, message: 'An error occurred when trying to save', errorDetails: err, documentDetails: obj}
    }
}

    export async function deleteItem(collectionName: string, id: number | string) {
        try {
            await deleteDoc(doc(db, collectionName, id.toString()))
            return {success: true, error: false, message: null, errorDetails: null}
        } catch (err) {
            return {success: false, error: true, message: 'Unable to delete', errorDetails: err}
        }
        
    }

    export async function findDocById(collectionName: string, id: number | string) {
        const docRef = doc(db, collectionName, id.toString())
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            return []
        }
    }

    export async function findByProperty(collectionName: string, property: string, value: any) {
        let returnArr: Array<any> = []
        const collectionRef = collection(db, collectionName)
        const q = query(collectionRef, where(property, "==", value.toString()))
        const querySnapshot = await getDocs(q)
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
    
