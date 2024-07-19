import type { Sizes } from './Plant'
import type { PhotoItem } from './Product'
import type { DocumentData } from 'firebase/firestore'

export type ShoppingCart = {
    id: number | undefined,
    cartItems: CartItem[],
}

export type CartItem = {
    sku: string,
    plantCategoryId: string | number,
    categoryId: string | number,
    quantity: number,
    maxQuantity: number,
    price: number,
    name: string,
    clone: string,
    photo: PhotoItem,
    size: Sizes,
    isDiscounted: boolean,
    isRepresentative: boolean,

}

export type ProductWithPrices = {[field: string]: any, prices: DocumentData[]}