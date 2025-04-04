import { Timestamp } from 'firebase-admin/firestore'
import { PotSize } from './Plants'

export type ShoppingCart = {
  cartItems: CartItem[]
}

export type CartItem = {
  sku: string
  plantCategoryId: string
  categoryId: string
  quantity: number
  maxQuantity: number
  price: number
  name: string
  clone: string
  // photo: PhotoItem,
  size: PotSize
  isDiscounted: boolean
  isRepresentative: boolean
  shelfLocation?: string
}
//export type StripeCartItem = StripeProduct & {quantity: number}

export type StripeProduct = {
  active: boolean
  description: string
  images: string[]
  metadata: { sku: string | number }
  name: string
  role: null
  stripe_metadata_sku: string | number
  tax_code: string
  price: StripePrice
  shippable?: boolean
  id?: string
}
export type StripePrice = {
  active: boolean
  billing_scheme: string
  currency: 'usd'
  description: string | null
  interval: string | null
  interval_count: null
  metadata: {}
  product: string
  recurring: null
  tax_behavior: string
  tiers: null
  tiers_mode: null
  transform_quantity: null
  trial_period_days: null
  type: string
  unit_amount: number
  id: string
}

export type StripeCartItem = {
  priceId: string
  quantity: number
}

export interface Discount {
  id: string
  amount_off: number
  percent_off: number
  valid: boolean
  validThrough: Timestamp
  duration: string
  message: string,
  type: 'multiplePlants' | 'buyGet' | 'siteWide'
  stripeCoupon?: boolean,
}

export interface MultiPlantDiscount extends Discount {
  type: 'multiplePlants'
  parameters: {
    minimumQuantity: number
  }
}

export interface BuyGetDiscount extends Discount {
  type: 'buyGet'
  parameters: {
    buyX: number
    getY: number
  }
}

export interface SiteWideDiscount extends Discount {
  type: 'siteWide'
}

export type DiscountableItem = {
  quantity: number,
  id: string,
  sku: string,
  price: number,
  unit_amount?: number,
  priceAfterDiscount?: number
}