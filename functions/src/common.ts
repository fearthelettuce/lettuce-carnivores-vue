import admin from 'firebase-admin'

export async function getNextSequentialId(collectionName: string, idFieldName: string = 'id') {
    const startingValue = 1000
    let docs: Array<unknown> | undefined = []
    try {
        docs = await getAllDocs(collectionName)
    } catch (err) {
        console.log(err)
    }
    let nextSequentialId: number
    if (docs.length > 0) {
        nextSequentialId = await docs.reduce((acc: number, doc: any) => acc = acc > parseInt(doc[idFieldName]) ? acc : parseInt(doc[idFieldName]), startingValue).valueOf()
        nextSequentialId++ 
    } else {
        return startingValue + 1
    }
    return nextSequentialId
}

export async function getAllDocs(collectionName: string) {
    const snapshot = await admin.firestore().collection(collectionName).get()
    return snapshot.docs.map(doc => doc.data())
}