import type { PhotoItem } from "@/components/modules/products/types/product"

export type PlantCategory = {
    name: string,
    genus: string,
    clone: string,
    description: string,
    id: string | number,
    plants: Plant[],
    status: string,
    photos: PhotoItem[],
}

export type Plant = {
    id: number | string,
    sku: string,
    isRepresentative: boolean,
    size: Sizes | undefined,
    propagationDate?: Date,
    status: string,
    price: number,
    discountedPrice?: number,
    isDiscounted: boolean,
    quantity: number,
    photos: PhotoItem[],
}

export enum Sizes {
    '_2.5' = '2.5"',
    '_3' = '3" deep',
    '_3.5' = '3.5"',
    '_3.5 deep' = '3.5" deep',
    '_4 deep' = '4" deep',
    '_bare' = 'Bare Root',
    
}