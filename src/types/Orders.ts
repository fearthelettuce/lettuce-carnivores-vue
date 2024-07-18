import type { Sizes } from './Plant'
import type { PhotoItem } from './Product'

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