import { describe, expect, it } from 'vitest'
import { SHIPPING_COST, calculateTotals } from './cart'

describe('calculateTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(calculateTotals([])).toEqual({
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      remainingForFreeShipping: 0,
    })
  })

  it('charges shipping below the free threshold', () => {
    const totals = calculateTotals([{ price: 12.99, quantity: 2 }])
    expect(totals.subtotal).toBe(25.98)
    expect(totals.shipping).toBe(SHIPPING_COST)
    expect(totals.tax).toBe(2.08)
    expect(totals.total).toBe(36.05)
    expect(totals.remainingForFreeShipping).toBe(74.02)
  })

  it('gives free shipping from 100', () => {
    const totals = calculateTotals([{ price: 50, quantity: 2 }])
    expect(totals.shipping).toBe(0)
    expect(totals.total).toBe(108)
    expect(totals.remainingForFreeShipping).toBe(0)
  })
})
