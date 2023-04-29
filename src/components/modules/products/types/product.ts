import type { Url } from "url"

type Product = {
    id: number,
    name: string,
    price: number,
    isForSale: boolean,
    quantity: number,
    images?: ProductImages
}

type ProductImages = {
    cardImageUrl?: string,
    primaryProductImageUrl?: string,
    additionalProductImageUrls?: [string],
    referenceImageUrl?: string,
}

type NepenthesImages  = {
    upperPitcherImageUrl: string,
    lowerPitcherImageUrl: string,
} & ProductImages

export type {Product, ProductImages, NepenthesImages}