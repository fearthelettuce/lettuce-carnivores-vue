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

export function unwrapResponse(res: any) {
    if('res' in res) {
        if('data' in res.res) {
            return res.res.data
        }
        if('res' in res.res) {
            return res.res.res
        }
        return res.res
    }
    if('data' in res) {
        if('data' in res.data) {
            return res.data.data
        }
        return res.data
    }
    return res
}
