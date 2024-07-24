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

export async function addProductToStripe(plant: Plant, plantCategory: PlantCategory) {
    const res = await getProductDetails()
    console.log(res)

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


export async function createStripeCheckoutSession(cart: CartItem[]){
    const functions = getFunctions()
    //connectFunctionsEmulator(functions,'127.0.0.1', 5001)
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