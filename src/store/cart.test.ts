import { beforeEach, describe, expect, it } from 'vitest'
import type { Product } from '../api/types'
import { selectCount, useCart } from './cart'

const product = (id: number, stock = 5): Product => ({
  id,
  title: `Product ${id}`,
  description: '',
  category: 'test',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock,
  thumbnail: '',
  images: [],
})

describe('cart store', () => {
  beforeEach(() => useCart.setState({ items: [], isOpen: false }))

  it('adds products and merges repeated lines', () => {
    const { add } = useCart.getState()
    add(product(1))
    add(product(1), 2)
    add(product(2))
    const state = useCart.getState()
    expect(state.items).toHaveLength(2)
    expect(state.items[0].quantity).toBe(3)
    expect(selectCount(state)).toBe(4)
  })

  it('never exceeds the available stock', () => {
    useCart.getState().add(product(1, 2), 5)
    expect(useCart.getState().items[0].quantity).toBe(2)
    useCart.getState().setQuantity(1, 10)
    expect(useCart.getState().items[0].quantity).toBe(2)
  })

  it('removes a line when the quantity reaches zero', () => {
    useCart.getState().add(product(1))
    useCart.getState().setQuantity(1, 0)
    expect(useCart.getState().items).toEqual([])
  })

  it('persists only the items', () => {
    useCart.getState().add(product(3))
    useCart.getState().open()
    const saved = JSON.parse(localStorage.getItem('shopfront.cart')!)
    expect(saved.state).toEqual({ items: [expect.objectContaining({ id: 3 })] })
  })
})
