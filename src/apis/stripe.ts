import { collection, getDocs, query, where, addDoc, onSnapshot, type DocumentData} from 'firebase/firestore';
import { db, auth } from '@/apis/firebase'
import type { StripeProduct, StripePrice, StripeCartItem} from '@/types/Orders';

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
    return querySnapshot.docs[0].data()
    // querySnapshot.forEach((doc) => {
    //     console.log('getItemBySku returning data')
    //     return doc.data()
    // })
}

export async function getProductBySku(sku: string): Promise<StripeProduct> {
    console.log('in getProductBySku')
    const collectionRef = collection(db, 'products')
    const q = query(collectionRef,
        where('stripe_metadata_sku', '==', sku)
    )

    const docRef = await getDocs(q)
    if(docRef.docs.length === 0) {
        throw new Error ('No products found')
    } else if (docRef.docs.length > 1) {
        throw new Error ('Multiple products found for that sku')
    }
    const doc = docRef.docs[0]
    const docData = await doc.data()

    const priceRef = collection(db, `products/${doc.id}/prices`)
    const priceSnap = await getDocs(priceRef)

    if(priceSnap.docs.length === 0) {
        throw new Error ('Error with product pricing information')
    } else if (priceSnap.docs.length > 1) {
        throw new Error ('Multiple prices found for that sku')
    }
    const priceId = priceSnap.docs[0].id
    const priceDoc = priceSnap.docs[0]
    const priceData = priceDoc.data()
    return {...doc.data(), price: {...priceData, id: priceId} as StripePrice} as StripeProduct
}

// async function getProductPrice(docRef: DocumentData) {
//     const priceSnap = await getDocs(collection(docRef,'prices'))
//     return priceSnap.docs[0]
//     //console.log(({...doc.data(), prices: priceSnap.docs[0].data()}))
//     // return ({...doc.data(), prices: priceSnap.docs})
//     // priceSnap.docs.forEach((priceDoc) => {
//     //     res.prices.push({...priceDoc.data(), id: priceDoc.id})
//     //     //console.log(priceDoc.id, ' => ', priceDoc.data());
//     // });

//     // })
//     // return res
// }

export async function createCheckoutSession(cart: StripeCartItem[]) {
    if(!auth || !auth.currentUser) { return }
    const lineItems = cart.map((item) => {
        return {price: item.price.id, quantity: item.quantity}
        // return {price_data: {
        //     currency: item.price.currency,
        //     unit_amount: item.price.unit_amount,
        //     product_data: {
        //         name: item.name,
        //         description: item.description,
        //         images: item.images[0],
        //         quantity: item.quantity,
        //     },
            
        // }}
    })
    console.log(lineItems)
    const collectionRef = await collection(db,'customers',auth.currentUser.uid, 'checkout_sessions')
    const docRef = await addDoc(collectionRef, {
        mode: 'payment',
        automatic_tax: true,
        success_url: `${window.location.origin}/checkoutcomplete`,
        cancel_url: `${window.location.origin}/cart`,
        line_items: lineItems,
        shipping_cost: 1000,
        shipping_options: ['shr_1PeUj7HlHApXEku97UWnEMtk'],
        collect_shipping_address: true,
    })
    onSnapshot(docRef, (snap) => {
        //@ts-ignore
        const { error, url } = snap.data()
        console.log(snap.data())
        if(error) {
            console.error(`An error occurred: ${error.message}`)
        }
        if(url) {
            window.location.assign(url)
        }
    })
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