import type {Product} from './product'

type Plant = {
    genus?: string,
    clone?: string | undefined,
    propagationMethod?: string,
    source?: string,
} & Product

export type {Plant}
