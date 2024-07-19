import { collection, getDocs, query, where, addDoc, onSnapshot, type DocumentData} from 'firebase/firestore';
import { db, auth } from '@/apis/firebase'
import type { ProductWithPrices } from '@/types/Orders';

export async function getActiveProducts() {
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
        priceSnap.docs.forEach((priceDoc) => {
        console.log(priceDoc.id, ' => ', priceDoc.data());
        docs.push({...doc.data(), price: {...priceDoc.data(), id: priceDoc.id}})
        });
    })
    return docs
}


export async function getProductBySku2(sku: string) {
    console.log('in getProductBySku')
    const collectionRef = collection(db, 'products')
    const q = query(collectionRef,
        where('stripe_metadata_sku', '==', sku)
    )

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        console.log('getItemBySku returning data')
        return doc.data()
    })
}

export async function getProductBySku(sku: string) {
    console.log('in getProductBySku')
    const collectionRef = collection(db, 'products')
    const q = query(collectionRef,
        where('stripe_metadata_sku', '==', sku)
    )

    const docRef = await getDocs(q)
    
    let res: ProductWithPrices = {prices: []}

    if(docRef.docs.length === 0) {
        throw new Error ('No products found')
    } else if (docRef.docs.length > 1) {
        throw new Error ('Multiple products found for that sku')
    }
    // } else {
    //     return querySnapshot.docs[0].data()
    // }

    const doc = docRef.docs[0]
    const docData = await doc.data()

    const price = await getProductPrice(doc)
    const priceData = await price.data()
    return {...docData, price: priceData}
    //return {...doc.data(), price: price.data()}
}

async function getProductPrice(docRef: DocumentData) {
    const priceSnap = await getDocs(collection(docRef,'prices'))
    return priceSnap.docs[0]
    //console.log(({...doc.data(), prices: priceSnap.docs[0].data()}))
    // return ({...doc.data(), prices: priceSnap.docs})
    // priceSnap.docs.forEach((priceDoc) => {
    //     res.prices.push({...priceDoc.data(), id: priceDoc.id})
    //     //console.log(priceDoc.id, ' => ', priceDoc.data());
    // });

    // })
    // return res
}

export async function createCheckoutSession(cart: ProductWithPrices[]) {
    if(!auth || !auth.currentUser) { return }
    const lineItems = cart.map((item) => {
        return {
            price: item.prices[0].id,
            quantity: item.quantity,
        }
    })
    const collectionRef = await collection(db,'customers',auth.currentUser.uid, 'checkout_sessions')
    const docRef = await addDoc(collectionRef, {
        mode: 'payment',
        automatic_tax: true, 
        collect_shipping_address: true,
        //https://www.youtube.com/watch?v=VnntkusKinM 9:40
        success_url: window.location.origin,
        cancel_url: window.location.origin,
        line_Items: lineItems,
    })
    onSnapshot(docRef, (snap) => {})
}
//     getDoc(collection(db, 'customers', ))
//     const docRef = await db
//         .collection('customers')
//         .doc(currentUser.uid)
//         .collection("checkout_sessions")
//         .add({
//             mode: "payment",
//             price: "price_1GqIC8HYgolSBA35zoTTN2Zl", // One-time price created in Stripe
//             success_url: window.location.origin,
//             cancel_url: window.location.origin,
//         });
// }

export async function addProductToStripe(product: any) {
    //take in productCategory and product Sku
    //push product to products collection
    //push price to product sub collection
}

//TODO:
//  Set checkout sessions to expire so that inventory goes back into 'stock'
//  https://docs.stripe.com/payments/checkout/managing-limited-inventory
//  Shipping
// Sign in with google popup