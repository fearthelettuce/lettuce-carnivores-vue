import { collection, doc, getDoc, getDocs, query, where, deleteDoc, setDoc, type WhereFilterOp } from 'firebase/firestore';
import type { PlantCategory, Plant, PlantWithCategoryDetails } from '@/types/Plant';
import type { CartItem } from '@/types/Orders';
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

export async function getNextSequentialId(collectionName: string, idFieldName: string = 'id', startingValue = 1000) {
    let docs: Array<unknown> | undefined = []
    try {
        docs = await findAll(collectionName)
    } catch (err) {
        console.log(err)
        return err
    }
    let nextSequentialId: number
    if (docs) {
        nextSequentialId = await docs.reduce((acc: number, doc: any) => acc = acc > doc[idFieldName] ? acc : doc[idFieldName], startingValue).valueOf()
        nextSequentialId++
    } else {
        return {success: false, error: true, message: 'Unable to get next ID'}
        // return startingValue + 1
    }
    return nextSequentialId
}

export async function saveItem(collectionName: string, obj: any) {
    if (obj == null || typeof obj !== 'object') {
        return {success: false, message: `Invalid object ${obj.toString()}`}
    }

    if (!Object.prototype.hasOwnProperty.call(obj, 'id') || !obj.id) {
        try {
            const nextId = await getNextSequentialId(collectionName, 'id')
            if(typeof nextId === 'number') {
                obj.id = nextId
            }
        } catch (e) {
            console.error(e)
            return
        }
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
    const docSnap = await getDoc(docRef).catch(e => console.error(e))
    if (docSnap && docSnap.exists()) {
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

export async function findAll<T>(collectionName: string, includeId: boolean = false) {
    const snap = await getDocs(collection(db, collectionName))
    if(includeId) {
       return snap.docs.map((doc) => {return {...doc.data() as T, id: doc.id} } )
    }
    return snap.docs.map(doc => doc.data() as T)
}



export async function getPlantsFromFirestore (cartItems: CartItem[]): Promise<Plant[]> {

    let plants: Plant[] = []
    for (const category of cartItems) {
        const docRef = doc(db, 'plantCategories', category.categoryId.toString())
        const snap = await getDoc(docRef).catch((e: any) => console.error(e))
        if(snap && snap.data()) {
            const data = snap.data() as PlantCategory
            plants = plants.concat(data.plants)
        }
    }
    return plants
}


export async function getAllPlants() {
    const plants: PlantWithCategoryDetails[] = []
    const res = await findAll('plantCategories')
    if(res) {
        for (const category of res as PlantCategory[]) {
            for(const plant of category.plants) {
                plants.push({...plant, name: category.name, genus: category.genus, clone: category.clone})
            }
        }
    }
    return plants
}
