import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../api/types'

export interface CartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  stock: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  add: (product: Product, quantity?: number) => void
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
  open: () => void
  close: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                  : item,
              ),
            }
          }
          const { id, title, price, thumbnail, stock } = product
          return {
            items: [...state.items, { id, title, price, thumbnail, stock, quantity: Math.min(quantity, stock) }],
          }
        }),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item,
                ),
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'shopfront.cart',
      // The drawer state is UI-only and should not be restored on reload.
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const selectCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
