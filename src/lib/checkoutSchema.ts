import { z } from 'zod'

/** Luhn checksum used by payment card numbers. */
export function isValidLuhn(digits: string): boolean {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

export function isFutureExpiry(value: string, now = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  // Cards are valid until the end of the expiry month.
  return new Date(year, month, 1) > now
}

// Messages are i18n keys, translated when rendered.
export const checkoutSchema = z.object({
  email: z.string().trim().email('checkout.errors.email'),
  fullName: z.string().trim().min(2, 'checkout.errors.required'),
  address: z.string().trim().min(4, 'checkout.errors.required'),
  city: z.string().trim().min(2, 'checkout.errors.required'),
  postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'checkout.errors.postal'),
  country: z.string().min(2, 'checkout.errors.required'),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ''))
    .refine((value) => /^\d{16}$/.test(value) && isValidLuhn(value), 'checkout.errors.card'),
  expiry: z.string().refine((value) => isFutureExpiry(value), 'checkout.errors.expiry'),
  cvc: z.string().regex(/^\d{3,4}$/, 'checkout.errors.cvc'),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutData = z.output<typeof checkoutSchema>
