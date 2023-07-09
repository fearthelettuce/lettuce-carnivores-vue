type Product = {
    id: number,
    name: string,
    price: number,
    isForSale: boolean,
    quantity: number,
    isDiscountable?: boolean,
    photoData?: PhotoDetails,
    photos: Array<PhotoItem>,
    propagationMethod: string,
    size: string,
    description: string,
    clone: string,
    genus: string,
    source: string,

}

type PhotoDetails = {
    primary?: ProductDetailItem,
    card?: ProductDetailItem,
    upper?: ProductDetailItem,
    lower?: ProductDetailItem,
}

type ProductDetailItem = {
    name: string,
    fullPath: string | URL
}
type PhotoItem = {
    name: string,
    type: PhotoTypes | undefined,
    path: string | URL,
    originalFilename: string,
}

export enum PhotoTypes {
    Primary = 'primary',
    Card = 'card',
    Additional = 'additional',
    Upper = 'upper',
    Lower = 'lower',
}


type ProductFilters = {
    [key: string] : any
}
export type { Product, ProductFilters, PhotoDetails, PhotoItem}
