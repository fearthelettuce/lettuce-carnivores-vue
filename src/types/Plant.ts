import type { PhotoItem } from "@/components/modules/products/types/product"

export type PlantCategory = {
    name: string,
    genus: string,
    clone: string,
    description: string,
    id: number | undefined,
    plants?: Plant[],
    status: string,
    referencePhotos?: PhotoItem,
}

export type Plant = {
    id: number,
    size: Sizes,
    propagationDate?: Date,
    status: string,
    price: number
    quantity: number,
}

export type PlantGeneric = {
    size: Sizes,
    propagationDate: Date,
    status: string,
    price: number
    quantity: number,
}

export enum Sizes {
    '_2.5' = '2.5"',
    '_3' = '3" deep',
    '_3.5' = '3.5"',
    '_3.5 deep' = '3.5" deep',
    '_4 deep' = '4" deep',
    '_bare' = 'Bare Root',
    
}