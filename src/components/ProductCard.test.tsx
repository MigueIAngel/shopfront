import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Product } from '../api/types'
import i18n from '../i18n'
import { useCart } from '../store/cart'
import { AddToCartButton } from './ProductActions'
import { ProductCard } from './ProductCard'

const product: Product = {
  id: 7,
  title: 'Red Lipstick',
  description: 'A lipstick',
  category: 'beauty',
  brand: 'Chic Cosmetics',
  price: 12.99,
  discountPercentage: 12.16,
  rating: 4.4,
  stock: 3,
  thumbnail: 'lipstick.png',
  images: [],
}

function renderCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={product} actions={<AddToCartButton product={product} compact />} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  beforeEach(async () => {
    useCart.setState({ items: [] })
    await i18n.changeLanguage('en')
  })

  it('shows price, original price and discount badge', () => {
    renderCard()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByText('$14.79')).toBeInTheDocument()
    expect(screen.getByText('-12%')).toBeInTheDocument()
  })

  it('adds the product to the cart', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(useCart.getState().items).toEqual([expect.objectContaining({ id: 7, quantity: 1 })])
    expect(screen.getByRole('button', { name: 'Added!' })).toBeInTheDocument()
  })

  it('formats prices for the Spanish locale', async () => {
    await i18n.changeLanguage('es')
    renderCard()
    expect(screen.getByText(/12,99/)).toBeInTheDocument()
  })
})
