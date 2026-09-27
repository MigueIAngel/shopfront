import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product } from '../api/types'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'

export function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { t } = useTranslation()
  const add = useCart((state) => state.add)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1200)
    return () => clearTimeout(timer)
  }, [added])

  if (product.stock === 0) {
    return <span className="text-sm text-stone-400">{t('product.outOfStock')}</span>
  }

  const label = added ? t('product.added') : t('product.addToCart')
  return (
    <button
      type="button"
      className={clsx(compact ? 'btn-primary h-10 w-10 p-0' : 'btn-primary', added && 'bg-emerald-600 hover:bg-emerald-600')}
      aria-label={label}
      title={label}
      onClick={() => {
        add(product)
        setAdded(true)
      }}
    >
      {compact ? (added ? '✓' : '+') : label}
    </button>
  )
}

export function WishlistButton({ product }: { product: Product }) {
  const { t } = useTranslation()
  const saved = useWishlist((state) => state.products.some((p) => p.id === product.id))
  const toggle = useWishlist((state) => state.toggle)
  const label = saved ? t('product.removeFromWishlist') : t('product.addToWishlist')
  return (
    <button
      type="button"
      className="btn-outline h-10 w-10 p-0 text-lg"
      aria-label={label}
      aria-pressed={saved}
      title={label}
      onClick={() => toggle(product)}
    >
      {saved ? '♥' : '♡'}
    </button>
  )
}
