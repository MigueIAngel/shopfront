import { describe, expect, it } from 'vitest'
import { checkoutSchema, isFutureExpiry, isValidLuhn } from './checkoutSchema'

const valid = {
  email: 'ana@example.com',
  fullName: 'Ana Gómez',
  address: 'Calle 1 #2-3',
  city: 'Barranquilla',
  postalCode: '080001',
  country: 'Colombia',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/99',
  cvc: '123',
}

describe('checkout validation', () => {
  it('accepts a valid order and normalizes the card number', () => {
    const result = checkoutSchema.parse(valid)
    expect(result.cardNumber).toBe('4242424242424242')
  })

  it('validates card numbers with the Luhn checksum', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true)
    expect(isValidLuhn('4242424242424241')).toBe(false)
    expect(checkoutSchema.safeParse({ ...valid, cardNumber: '1234 5678 9012 3456' }).success).toBe(false)
  })

  it('rejects expired or malformed expiry dates', () => {
    const now = new Date(2026, 8, 27)
    expect(isFutureExpiry('09/26', now)).toBe(true)
    expect(isFutureExpiry('08/26', now)).toBe(false)
    expect(isFutureExpiry('13/30', now)).toBe(false)
    expect(isFutureExpiry('1230', now)).toBe(false)
  })

  it('returns i18n keys as error messages', () => {
    const result = checkoutSchema.safeParse({ ...valid, email: 'nope', cvc: '1' })
    expect(result.success).toBe(false)
    const messages = result.error!.issues.map((issue) => issue.message)
    expect(messages).toEqual(expect.arrayContaining(['checkout.errors.email', 'checkout.errors.cvc']))
  })
})
