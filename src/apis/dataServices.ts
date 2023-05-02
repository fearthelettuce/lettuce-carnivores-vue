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

async function getNextSequentialId(collectionName: string) {
    const startingValue = 1000
    let docs: Array<unknown> | undefined = []
    docs = await findAll(collectionName)
    let nextSequentialId: number = 0
    if (docs) {
        nextSequentialId = docs.reduce((acc: Number, doc: any) => acc = acc > doc.id ? acc : doc.id, startingValue).valueOf()
        nextSequentialId ++ 
    } else {
        return startingValue + 1
    }
    return nextSequentialId
}

export async function saveItem(collectionName: string, obj: object) {
    let objId
    if (Object.hasOwnProperty('id')) {
        objId = obj['id']
    }
    if (!objId) {
        let nextId: number = await getNextSequentialId(collectionName)
        Object.assign(obj, { id: nextId })
        await addDoc(collection(db, collectionName), obj)
            .then((docRef) => { return docRef.id })
            .catch((error) => {
                console.log(error)
                return
            })
    } else {
        let docUid: UUID
        let docRef: DocumentReference | undefined
        await findDocById(collectionName, objId).then((res)=>{if(res) {docUid = res}}).catch((err) =>{console.log(err)})
        if (docRef) {
            await setDoc(doc(db,collectionName,docRef), obj)
                .then((res) => { console.log(res) })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
}

    export async function deleteItem(collectionName: string, id: number) {
        let docRef: DocumentReference | undefined
        try {
            docRef = await findDocById(collectionName, id)
        } catch (error) {
            console.log(error)
        }
        if (docRef) {
            await deleteDoc(doc(db, collectionName, docRef.id))
        } else {
            console.log(`Did not find document for id ${id}`)
            return
        }
    }

    async function findDocById(collectionName: string, id: any) {
        const collectionRef = collection(db, collectionName)
        const q = query(collectionRef, where('id', "==", id))
        const querySnapshot = await getDocs(q);
        let returnDoc
        querySnapshot.forEach((doc) => {
            returnDoc = doc
        })
        return returnDoc
    }

    export async function findByProperty(collectionName: string, property: string, value: any) {
        let returnArr: Array<any> = []
        const collectionRef = collection(db, collectionName)
        const q = query(collectionRef, where(property, "==", value))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
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