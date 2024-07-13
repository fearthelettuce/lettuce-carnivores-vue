import type { PhotoItem } from "@/types/Product"

export type PlantCategory = {
    name: string,
    genus: string,
    clone: string,
    speciesHybrid: '' | 'Species' | 'Hybrid',
    experience: '' | 'Beginner Friendly' | 'Intermediate' | 'Advanced',
    description: string,
    id: string | number,
    plants: Plant[],
    status: 'In Stock' | 'Coming Soon' | 'Sold' | 'Archived' | 'Hidden',
    photos: PhotoItem[],
}

export type Plant = {
    id: number | string,
    sku: string,
    isRepresentative: boolean,
    size: Sizes,
    propagationDate?: Date,
    status:  'In Stock' | 'Coming Soon' | 'Sold' | 'Archived' | 'Hidden',
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