export interface Product {
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

export type PhotoItem = {
    name: string,
    folder: string,
    originalFilename: string,
    path: string,
    date: Date,
}

export enum PhotoTypes {
    Primary = 'primary',
    Card = 'card',
    Additional = 'additional',
    Upper = 'upper',
    Lower = 'lower',
}

export type ProductFilters = {
    [key: string] : any
}

export type PhotoSizes = 256 | 512 | 960 | 1600
