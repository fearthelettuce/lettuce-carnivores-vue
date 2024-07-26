import { collection, getDocs, query, where} from 'firebase/firestore';
import { db } from '@/apis/firebase'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

import { type CartItem } from '@/types/Orders';
import { findDocById } from './dataServices'
import { useUserStore } from '@/components/modules/auth/stores/users'

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


export async function createStripeCheckoutSession(cart: CartItem[]){
    const { user } = useUserStore()
    let stripeCustomer = undefined
    if(user && user.uid) {
        stripeCustomer = await findDocById('customers', user.uid)
    }
    const functions = getFunctions()
    //connectFunctionsEmulator(functions,'127.0.0.1', 5001)
    const createCheckoutSession: Function = httpsCallable(functions, 'createCheckoutSession')
    const res = await createCheckoutSession({
        cart: cart, 
        customerEmail: 'test@gmail.com',
        returnUrl: `${window.location.origin}/checkoutcomplete`,
        cancelUrl:`${window.location.origin}/cart`,
        stripeCustomer: stripeCustomer,
    })
    console.log(res)
    return res
}
