import { collection, doc, getDoc, getDocs, query, where, deleteDoc, setDoc, type WhereFilterOp } from 'firebase/firestore';
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
    let nextSequentialId: number
    if (docs) {
        nextSequentialId = await docs.reduce((acc: number, doc: any) => acc = acc > doc[idFieldName] ? acc : doc[idFieldName], startingValue).valueOf()
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

    if (!Object.prototype.hasOwnProperty.call(obj, 'id') || !obj.id) {
        const nextId: number = await getNextSequentialId(collectionName, 'id')
        obj.id = nextId
    } 
    try {
        const res = await setDoc(doc(db, collectionName, obj.id.toString()), { ...obj })
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

export async function findByProperty(collectionName: string, property: string, comparison: WhereFilterOp = "==", value: any) {
    const returnArr: Array<any> = []
    const q = query(collection(db, collectionName), where(property, comparison, value))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        returnArr.push({...doc.data()})
    })
    return returnArr
}

export async function findAll(collectionName: string) {
    const returnArr: Array<unknown> = []
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


import type { CartItem } from '@/types/Orders';
import type { PlantCategory, Plant } from '@/types/Plant';
export async function getPlantsFromFirestore (cartItems: CartItem[]): Promise<Plant[]> {

    let plants: Plant[] = []
    // const q = query(collection(db, 'plantCategories'), where(''))
    for (const category of cartItems) {
        const docRef = doc(db, 'plantCategories', category.categoryId.toString())
        //get(db, `plantCategory/${category.categoryId}`)
        const snap = await getDoc(docRef).catch((e: any) => console.error(e))
        if(snap && snap.data()) {
            const data = snap.data() as PlantCategory
            plants = plants.concat(data.plants)
        }
    }
    return plants
}

