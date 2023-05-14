type Product = {
    id: number,
    name: string,
    price: number,
    isForSale: boolean,
    quantity: number,
    isDiscountable?: boolean,
    photoData?: ProductPhotos
}

type ProductPhotos = {
    primary: ProductPhotoItem,
    card: ProductPhotoItem,
    additional: Array<ProductPhotoItem>,
    upper: ProductPhotoItem,
    lower: ProductPhotoItem,
}

type ProductPhotoItem = {
    name: string,
    fullPath: string
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
export type { Product, ProductImages, NepenthesImages, ProductFilters, ProductPhotos}