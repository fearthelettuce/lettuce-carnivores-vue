import type {Product, ProductImages} from './product'

type Plant = {
    genus: string,
    clone?: string | undefined,
    propagationType?: string,
    source?: string,
    images?: ProductImages | NepenthesImages
} & Product

type NepenthesImages  = {
    upperPitcherImageUrl: string,
    lowerPitcherImageUrl: string,
} & ProductImages

export type {Plant, NepenthesImages}