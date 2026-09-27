import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../api/types'

interface WishlistState {
  products: Product[]
  toggle: (product: Product) => void
  has: (id: number) => boolean
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      products: [],
      toggle: (product) =>
        set((state) => ({
          products: state.products.some((p) => p.id === product.id)
            ? state.products.filter((p) => p.id !== product.id)
            : [...state.products, product],
        })),
      has: (id) => get().products.some((p) => p.id === id),
    }),
    { name: 'shopfront.wishlist' },
  ),
)
