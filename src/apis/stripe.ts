import { collection, getDoc, getDocs, query, where, deleteDoc, setDoc, collectionGroup, type DocumentData } from 'firebase/firestore';
import { db} from '@/apis/firebase'

export async function getActiveProducts() {
    console.log('hi')
    const q = query(collection(db, 'products'),
        where('active', '==', true)
    )

    const querySnapshot = await getDocs(q)
    if(querySnapshot.docs.length === 0) {
        throw new Error ('No products found')
    }
    let docs: any = []
    querySnapshot.forEach(async (doc) => {
        const priceSnap = await getDocs(collection(doc.ref,'prices'))
        // await getDoc(db,)
        // await doc.ref
        priceSnap.docs.forEach((priceDoc) => {
        console.log(priceDoc.id, ' => ', priceDoc.data());
        docs.push({...doc.data(), price: priceDoc.data()})
        });
    })
    return docs

}

//TODO:
//  Set checkout sessions to expire so that inventory goes back into 'stock'
//  https://docs.stripe.com/payments/checkout/managing-limited-inventory
//  Shipping
// Sign in with google popup