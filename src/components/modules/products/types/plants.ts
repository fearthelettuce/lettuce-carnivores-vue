import type {Product, PhotoItem} from './product'

export type Plant = {
    id: number,
    name: string,
    genus?: string,
    classification?: "Species" | "Hybrid",
    clone?: string,
    source?: string,
    photos: Array<PhotoItem>,
    acquisitionDate?: Date,

}

export interface Specimen extends Product {
    productId: number,
    size: string,
    propagationMethod?: string,
    propagationDate?: Date,
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
