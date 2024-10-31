import admin from 'firebase-admin'

export async function getNextSequentialId(collectionName: string, startingValue = 1000, idFieldName: string = 'id') {
    let docs: Array<unknown> | undefined = []
    try {
        docs = await getAllDocs(collectionName)
    } catch (err) {
        console.log(err)
        return undefined
    }
    let nextSequentialId: number
    if (docs.length === 0) {
        return startingValue
    } else {
        nextSequentialId = docs.reduce((acc: number, doc: any) => acc = acc > parseInt(doc[idFieldName]) ? acc : parseInt(doc[idFieldName]), startingValue).valueOf()
        nextSequentialId++
    }
    return nextSequentialId
}

export async function getAllDocs(collectionName: string) {
    const snapshot = await admin.firestore().collection(collectionName).get()
    return snapshot.docs.map(doc => doc.data())
}

export function unwrapResponse(obj: any) {
    if(!obj || typeof obj !== 'object') {
        return obj
    }
    if('data' in obj) {
        return unwrapResponse(obj.data)
    }
    if('res' in obj) {
        return unwrapResponse(obj.res)
    }
    return obj
}
