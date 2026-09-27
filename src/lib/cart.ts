export const FREE_SHIPPING_THRESHOLD = 100
export const SHIPPING_COST = 7.99
export const TAX_RATE = 0.08

export interface CartLine {
  price: number
  quantity: number
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
  remainingForFreeShipping: number
}

const round = (value: number) => Math.round(value * 100) / 100

export function calculateTotals(lines: CartLine[]): CartTotals {
  const subtotal = round(lines.reduce((sum, line) => sum + line.price * line.quantity, 0))
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = round(subtotal * TAX_RATE)
  return {
    subtotal,
    shipping,
    tax,
    total: round(subtotal + shipping + tax),
    remainingForFreeShipping: subtotal === 0 ? 0 : round(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)),
  }
}
