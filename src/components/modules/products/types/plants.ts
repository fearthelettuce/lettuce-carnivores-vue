import type {Product} from './product'

type Plant = {
    genus?: string,
    clone?: string | undefined,
    propagationMethod?: string,
    propagationDate?: Date,
    source?: string,
} & Product

export type {Plant}
