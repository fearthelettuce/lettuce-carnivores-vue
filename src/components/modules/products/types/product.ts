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
    name: string,
    cardImageUrl?: string,
    primaryProductImageUrl?: string,
    additionalProductImageUrls?: [string],
    referenceImageUrls?: [string],
}

type NepenthesImages  = {
    upperPitcherImageUrl?: string,
    lowerPitcherImageUrl?: string,
} & ProductImages

type ProductFilters = {
    [key: string] : any
}
export type { Product, ProductImages, NepenthesImages, ProductFilters}