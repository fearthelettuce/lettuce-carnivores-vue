import type {Product, ProductImages} from './product'

type Plant = {
    genus?: string,
    clone?: string | undefined,
    propagationMethod?: string,
    source?: string,
    images?: ProductImages | NepenthesImages
} & Product

type NepenthesImages  = {
    upperPitcherImageUrl?: string,
    lowerPitcherImageUrl?: string,
    tempUrl: URL,
} & ProductImages

export type {Plant, NepenthesImages}