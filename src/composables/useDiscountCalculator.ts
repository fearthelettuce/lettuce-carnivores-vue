import type { CartItem, BuyGetDiscount } from '@/types/Orders'

export function calculateBuyGetDiscounts(cartItems: CartItem[], discount: BuyGetDiscount) {
  // if (discount.type !== 'buyGet' || !discount.percent_off || !discount.parameters.buyX || !discount.parameters.getY) {
  //   return null
  // }
  // const buyX = discount.parameters.buyX
  // const getY = discount.parameters.getY
  const buyX = 2
  const getY = 1
  const cartItemWithId = cartItems.map((item) => ({ ...item, id: item.sku }))
  const sortedItems = spreadArray<CartItem>(cartItemWithId).sort((a, b) => b.price - a.price)
  let totalDiscount = 0
  const discountedItems: CartItem[] = []
  let itemsBoughtCounter = 0
  let discountedItemCounter = 0

  for (let item of sortedItems) {
    if (discountedItemCounter > 0) {
      discountedItemCounter--
      discountedItems.push(item)
      totalDiscount += item.price * discount.percent_off
      continue
    }
    itemsBoughtCounter++
    if (itemsBoughtCounter === buyX) {
      itemsBoughtCounter -= buyX
      discountedItemCounter += getY
    }
  }
  let message = ``
  if (itemsBoughtCounter !== 0) {
    const itemsToQuality = buyX - itemsBoughtCounter
    message = `Add ${itemsToQuality} more plant${itemsToQuality > 1 ? 's' : ''} to quality for `
    if (discount.percent_off === 100) {
      message = `${message} ${getY} free plant${getY > 1 ? 's' : ''}`
    } else {
      message = `${message} ${getY}% off another plant`
    }
  }
  if (discountedItemCounter > 0) {
    message = `You quality for ${discountedItemCounter} free plant${discountedItemCounter > 1 ? 's' : ''}`
  }
  return {
    discountedItems: combineArray(discountedItems),
    totalDiscount,
    message,
  }
}

type ArrItem = {
  id: string
  quantity: number
}
function spreadArray<T extends ArrItem>(arr: T[]) {
  const result: T[] = []
  for (const item of arr) {
    if (item.quantity === 1) {
      result.push(item)
    } else {
      for (let i = 0; i < item.quantity; i++) {
        const newArrItem = { ...item, quantity: 1 }
        result.push(newArrItem)
      }
    }
  }
  return result
}
function combineArray<T extends ArrItem>(arr: T[]): T[] {
  const combinedItems: { [id: string]: T } = {}

  for (const item of arr) {
    if (combinedItems[item.id]) {
      combinedItems[item.id].quantity += item.quantity
    } else {
      combinedItems[item.id] = { ...item }
    }
  }

  return Object.values(combinedItems)
}
// export function calculateBuyGetDiscounts(cartItems: CartItem[], discount: BuyGetDiscount) {
//   if (discount.type !== 'buyGet' || !discount.percent_off || !discount.parameters.buyX || !discount.parameters.getY) {
//     return null
//   }
//   const buyX = discount.parameters.buyX
//   const getY = discount.parameters.getY
//   const sortedItems = cartItems.sort((a, b) => b.price - a.price)
//   console.log(sortedItems)
//   let totalDiscount = 0
//   const discountedItems: CartItem[] = []
//   let buyCounter = 0
//   let discountCounter = 0
//   for (let i = 0; i < sortedItems.length; i++) {
//     buyCounter += cartItems[i].quantity
//     if (buyCounter >= buyX) {
//       const freeItemMultiplier = Math.floor(buyCounter / buyX)
//       discountCounter += freeItemMultiplier * getY
//       buyCounter -= freeItemMultiplier * buyX
//     }
//     if (discountCounter === 0) {
//       continue
//     }
//     for (let y = 0; y < sortedItems[i].quantity; y++) {
//       discountCounter--
//       const discountedAmount = sortedItems[i].price * discount.percent_off
//       totalDiscount += discountedAmount
//       discountedItems.push(sortedItems[i])
//     }
//   }
// }
