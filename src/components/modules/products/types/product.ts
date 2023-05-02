type Product = {
    id: number,
    name: string,
    price: number,
    isForSale: boolean,
    quantity: number,
    isDiscountable?: boolean,
    referenceImages?: ProductImages,
    actualImages?: ProductImages,
}

type ProductImages = {
    cardImageUrl?: string,
    primaryProductImageUrl?: string,
    additionalProductImageUrls?: [string],
    referenceImageUrls?: [string],
}

type NepenthesImages  = {
    upperPitcherImageUrl?: string,
    lowerPitcherImageUrl?: string,
} & ProductImages

export type { Product, ProductImages, NepenthesImages }
1

