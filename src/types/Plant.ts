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
    size: Sizes,
    propagationDate?: Date,
    status: string,
    price: number,
    discountedPrice?: number,
    isDiscounted: boolean,
    quantity: number,
    photos: PhotoItem[],
}

export type Sizes = 
    '' |
    '2.5"' | 
    '3" deep' | 
    '3.5"' | 
    '3.5" deep' | 
    '4" deep' | 
    'Bare Root'