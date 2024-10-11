export type PlantCategory = {
    name: string,
    genus: string,
    clone: string,
    speciesHybrid: '' | 'Species' | 'Hybrid',
    experience: '' | 'Beginner Friendly' | 'Intermediate' | 'Advanced',
    description: string,
    id: string,
    plants: Plant[],
    status: 'In Stock' | 'Coming Soon' | 'Archived' | 'Hidden' | 'Sold',
    photos: PhotoItem[],
}

export type Plant = {
    id: string,
    sku: string,
    isRepresentative: boolean,
    size: Sizes,
    propagationDate?: string ,
    status:  'In Stock' | 'Coming Soon' | 'Archived' | 'Hidden' | 'Sold',
    price: number,
    discountedPrice?: number,
    isDiscounted?: boolean,
    quantity: number,
    photos: PhotoItem[],
    plantCategoryId: string,
    shelfLocation?: string,
    dateListedForSale?: Date | undefined,
}
export interface PlantWithCategoryDetails extends Plant {
    name: string,
    genus: string,
    clone: string,
}
export type Sizes =
    '' |
    '2.5"' |
    '3" deep' |
    '3.5"' |
    '3.5" deep' |
    '4" deep' |
    '4.5" deep' |
    '5" deep' |
    'Bare Root'


type PhotoItem = {
    name: string,
    folder: string,
    originalFilename: string,
    path: string,
    date: Date,
}
