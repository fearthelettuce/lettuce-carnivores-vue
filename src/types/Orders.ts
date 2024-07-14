export type ShoppingCart = {
    id: number | undefined,
    cartItems: CartItem[],
}

export type CartItem = {
    sku: string,
    categoryId: string | number,
    quantity: number,
    price: number,
}