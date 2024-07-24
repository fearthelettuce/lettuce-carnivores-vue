import { collection, doc, getDoc, getDocs, query, where, addDoc, onSnapshot} from 'firebase/firestore';
import { db, auth } from '@/apis/firebase'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import type { StripeProduct, StripePrice, StripeCartItem} from '@/types/Orders';
import type { PlantCategory, Plant } from '@/types/Plant'
import { getPhotoDownloadUrl } from './fileServices';
import { type CartItem } from '@/types/Orders';

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


// export async function getProductBySku2(sku: string) {
//     console.log('in getProductBySku')
//     const collectionRef = collection(db, 'products')
//     const q = query(collectionRef,
//         where('stripe_metadata_sku', '==', sku)
//     )

//     const querySnapshot = await getDocs(q)
//     return querySnapshot.docs[0].data()
// }

// export async function getProductBySku(sku: string): Promise<StripeProduct> {

//     const docRef = doc(db, 'products', sku)
//     // const collectionRef = collection(db, 'products')
//     // const q = query(collectionRef,
//     //     where('stripe_metadata_sku', '==', sku)
//     // )

//     // const docRef = await getDocs(q)
//     // if(docRef.docs.length === 0) {
//     //     throw new Error ('No products found')
//     // } else if (docRef.docs.length > 1) {
//     //     throw new Error ('Multiple products found for that sku')
//     // }
//     // const doc = docRef.docs[0]
//     const docSnap = await getDoc(docRef)
//     if(doc === undefined) { return }
//     const docData = await docSnap.data()

//     const priceRef = collection(db, `products/${docSnap.id}/prices`)
//     const priceSnap = await getDocs(priceRef)

//     if(priceSnap.docs.length === 0) {
//         throw new Error ('Error with product pricing information')
//     } else if (priceSnap.docs.length > 1) {
//         throw new Error ('Multiple prices found for that sku')
//     }
//     const priceId = priceSnap.docs[0].id
//     const priceDoc = priceSnap.docs[0]
//     const priceData = priceDoc.data()
//     return {...docSnap.data(), price: {...priceData, id: priceId} as StripePrice} as StripeProduct
// }

// export async function createCheckoutSession(cart: StripeCartItem[]) {
//     if(!auth || !auth.currentUser) { return }
//     const lineItems = cart.map((item) => {
//         return {price: item.priceId, quantity: item.quantity}
//     })
//     console.log(lineItems)
//     const collectionRef = await collection(db,'customers',auth.currentUser.uid, 'checkout_sessions')
//     const docRef = await addDoc(collectionRef, {
//         mode: 'payment',
//         automatic_tax: true,
//         tax_id_collection: true,
//         success_url: `${window.location.origin}/checkoutcomplete`,
//         cancel_url: `${window.location.origin}/cart`,
//         line_items: lineItems,
//         //shipping_rates: ['shr_1PeUj7HlHApXEku97UWnEMtk', 'shr_1PeV9AHlHApXEku9nZGfZY3C'], //not working
//         // shipping_options: [{
//         //     id: 'basic',
//         //     label: 'Ground shipping',
//         //     detail: 'Ground shipping via UPS or USPS',
//         //     amount: 8.50,
//         // }],
//         collect_shipping_address: true,
//     })
//     onSnapshot(docRef, (snap) => {
//         //@ts-ignore
//         const { error, url } = snap.data()
//         console.log(snap.data())
//         if(error) {
//             console.error(`An error occurred: ${error.message}`)
//         }
//         if(url) {
//             window.location.assign(url)
//         }
//     })
// }

export async function addProductToStripe(plant: Plant, plantCategory: PlantCategory) {
    const res = await getProductDetails()
    console.log(res)
    // const functions = getFunctions()
    // connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    // const createProductInStripe = httpsCallable(functions, 'createProductInStripe')

    // const stripeProduct = await createStripeProduct(plant, plantCategory)
    // //const res = await fetch('https://createproductinstripe-pdapqawq6q-uc.a.run.app', {
    // //const res = await fetch('http://127.0.0.1:5001/lettuce-carnivores/us-central1/createProductInStripe', {
    // //     method: "POST",
    // //     body: JSON.stringify(stripeProduct)
    // // })

    // try {
    //     const res = await createProductInStripe(stripeProduct)
    //     //as {success: boolean, error: boolean, message: string | null, errorDetails: any | null, data: Object | null})
    //     console.log(res)
    //     return res.data
    // } catch (e: any) {
    //     console.error(e)
    //     return e
    // }
}

export async function getProductDetails() {
    const mockData = {
        categories: [
            {id: 12},
            {id: 19}
        ],
        collection: 'plantCategories',
    }
    const functions = getFunctions()
    // connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    const getPlantDetailsFromFirestore = httpsCallable(functions, 'getPlantDetailsFromFirestore')

    const res = await getPlantDetailsFromFirestore(mockData)
    console.log(res)
    return res
}

async function createStripeProduct (plant: Plant, plantCategory: PlantCategory) {
    //const image = await getPhotoDownloadUrl(plant.photos[0])
    return {
        id: plant.sku,
        description: plant.size,
        // images: [`${getPhotoUrl(plant.photos[0].path,256)}`],
        //images: [image],
        //images: ['https://picsum.photos/280/320?random=4'],
        //images: ['https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2FIMG20231110094027_256x256?alt=media&token=342ee06c-b448-4bbb-88e9-14f15a7e5ef6'],
        metadata: {
            sku: plant.sku
        },
        name: plantCategory.name,
        active: true,
        shippable: true,
        tax_code: 'txcd_99999999',
        default_price_data: {
            currency: 'usd',
            unit_amount: plant.price * 100,
        }
    }
}

export async function createStripeCheckoutSession(cart: CartItem[]){
    const functions = getFunctions()
    connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    const createCheckoutSession: Function = httpsCallable(functions, 'createCheckoutSession')
    const res = await createCheckoutSession({
        cart: cart, 
        customerEmail: 'test@gmail.com',
        returnUrl: `${window.location.origin}/checkoutcomplete`,
        cancelUrl:`${window.location.origin}/cart`
    })
    console.log(res)
    return res
}
//TODO:
//  Set checkout sessions to expire so that inventory goes back into 'stock'
//  https://docs.stripe.com/payments/checkout/managing-limited-inventory
//  Shipping
// Sign in with google popup