import type {Product, PhotoItem} from './product'

export type Plant = {
    genus?: string,
    clone?: string | undefined,
    propagationMethod?: string,
    propagationDate?: Date,
    source?: string,
} & Product

export type Specimen = {
    id: number,
    productId: number,
    size: string,
    propagationMethod?: string,
    propagationDate?: Date,
    price?: number,
    isForSale?: boolean,
    quantity: number,
    photos: Array<PhotoItem>,
}

export enum propagationMethods {
    STEM_CUTTING = 'Stem Cutting',
    BASAL_DIVISION = 'Basal Division', 
    DIVISION = 'Division', 
    SEED_GROWN = 'Seed Grown', 
    TISSUE_CULTURE = 'Tissue Culture', 
    OTHER = 'Other', 
    UNKNOWN = 'Unknown'
}
