type Product = {
    id: number,
    name: string,
    price: number,
    isForSale: boolean,
    quantity: number,
    isDiscountable?: boolean,
    photoData?: ProductPhotos,
    photos: Array<PhotoItem>,
}

type ProductPhotos = {
    primary: ProductPhotoItem,
    card: ProductPhotoItem,
    additional: Array<ProductPhotoItem>,
    upper: ProductPhotoItem,
    lower: ProductPhotoItem,
}

type PhotoItem = {
    name: string,
    type: PhotoTypes,
    path: string | URL,
    isUploaded: boolean,
    originalFilename: string,
}

enum PhotoTypes {
    Primary = 'primary',
    Card = 'card',
    Additional = 'additional',
    Upper = 'upper',
    Lower = 'lower',
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
export type { Product, ProductImages, NepenthesImages, ProductFilters, ProductPhotos, PhotoTypes}