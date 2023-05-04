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
    docs = await findAll(collectionName)
    let nextSequentialId: number = 0
    if (docs) {
        nextSequentialId = docs.reduce((acc: Number, doc: any) => acc = acc > doc[idFieldName] ? acc : doc[idFieldName], startingValue).valueOf()
        nextSequentialId ++ 
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
        console.log(obj)
        // let nextId: number = await getNextSequentialId(collectionName, 'plantId')
        await getNextSequentialId(collectionName, 'plantId')
            .then(res => {obj.id = res})
            .then((res) => {
                setDoc(doc(db, collectionName, obj.id), obj)
            }).then((res) => {
                console.log(res)
                return res
            })
        // console.log(obj.id)
        // await setDoc(doc(db, collectionName, obj.id), obj).then(res => {
        //     console.log(res)
        //     return res
        // })
        // addDoc(collection(db, collectionName), obj).then(res => {
        //     console.log(res)
        //     return res
        // })
        // if (nextId && nextId > 0) {
        //     obj.id = nextId
        // } else {
        //     //TODO handle error
        // }
        // await console.log(objId)

        // let saveDocResponse = await addDoc(collection(db, collectionName), obj)
        // console.log('response from firebase:')
        // console.log(saveDocResponse)
        // if (saveDocResponse) {
        //     return {success: true, plant: obj}
        // } else {
        //     //TODO handle error
        //     console.log(saveDocResponse)
        //     console.log(obj)
        //     return {error: true, message: 'Unable to save'}
        // }
        
    } else {
        console.log(obj)
        let docUid: UUID
        let docRef: DocumentReference | undefined
        await findDocById(collectionName, objId).then((res)=>{if(res) {docUid = res}}).catch((err) =>{console.log(err)})
        if (docRef) {
            await setDoc(doc(db,collectionName,docRef), obj)
                .then((res) => {
                    console.log(res.data)
                    return res
                })
                .catch((err) => {
                    console.log(err)
                    return err
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
            await deleteDoc(doc(db, collectionName, docRef.id)).then((res) => { return res }).catch((err) => {
                return {error: true, message: 'Unable to delete', errorDetails: err}
            })
        } else {
            return {error: true, message: `Did not find document for id ${id}`}
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
    
