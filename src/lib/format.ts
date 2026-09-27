export function formatPrice(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value)
}

/** Price before the discount, rounded to cents. */
export function originalPrice(price: number, discountPercentage: number): number {
  return Math.round((price / (1 - discountPercentage / 100)) * 100) / 100
}
