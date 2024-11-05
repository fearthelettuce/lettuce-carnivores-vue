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

export function getUpdateDateTime() {
    const updatedDateTime = new Date().toLocaleString("en-US", {timeZone: 'America/Chicago'})
    const updatedTimestamp = Math.floor(Date.now() / 1000)
    return { updatedDateTime, updatedTimestamp}
}

// async function updateInventory(: StripeLineItem[]) {
//     for (const item of items) {
//         const data = item.price_data.product_data.metadata
//         await deleteEbayInventoryItem(data.sku)
//         const quantity = item.quantity
//         const docRef = admin.firestore().doc(`plantCategories/${data.categoryId}`)
//         const doc = await docRef.get().catch((e: any) => log(e))

//         if(!doc || !doc.data()){
//             log(`Error getting doc ${docRef.toString()}`)
//             log(`${item}`)
//             return
//         }
//         const plantCategory = doc.data()!
//         const plantIndex = plantCategory.plants.findIndex((plant: Plant) => plant.sku === data.sku)

//         if(plantCategory.plants[plantIndex].quantity === 1) {
//             plantCategory.plants[plantIndex].status = 'Sold'
//             plantCategory.plants[plantIndex].quantity = 0
//         } else {
//             if(quantity > plantCategory.plants[plantIndex].quantity) {
//                 plantCategory.plants[plantIndex].quantity = 0
//                 log(`Plant ${plantCategory.plants[plantIndex].sku} quantity ${plantCategory.plants[plantIndex].quantity} less than cart quantity ${quantity}`)
//             } else {
//                 plantCategory.plants[plantIndex].quantity = plantCategory.plants[plantIndex].quantity - quantity
//             }
//         }
//         await docRef.update({plants: plantCategory.plants})
//     }
//     return
// }
