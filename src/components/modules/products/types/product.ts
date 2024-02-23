interface Product {
    id: number,
    name: string,
    price?: number,
    isForSale: boolean,
    quantity: number,
    isDiscountable?: boolean,
    photos: Array<PhotoItem>,
    description: string,
    category?: string,
    plantId?: number | undefined,
}

type PhotoItem = {
    name: string,
    type: PhotoTypes | undefined,
    folder: string,
    originalFilename: string,
    path: string,
    isReferencePhoto: boolean,
    date: Date,
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
export type { Product, ProductFilters, PhotoItem}
