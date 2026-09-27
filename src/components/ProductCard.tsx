import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Product } from '../api/types'
import { formatPrice, originalPrice } from '../lib/format'
import { Rating } from './Rating'

interface ProductCardProps {
  product: Product
  actions?: React.ReactNode
}

export function ProductCard({ product, actions }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? 'en'
  const hasDiscount = product.discountPercentage >= 5

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="relative block aspect-square bg-stone-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-bold text-white">
            {t('product.off', { percent: Math.round(product.discountPercentage) })}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          {product.brand ?? product.category}
        </p>
        <h3 className="line-clamp-2 font-medium">
          <Link to={`/products/${product.id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <Rating value={product.rating} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p>
            <span className="text-lg font-bold">{formatPrice(product.price, locale)}</span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-stone-400 line-through">
                {formatPrice(originalPrice(product.price, product.discountPercentage), locale)}
              </span>
            )}
          </p>
          {actions}
        </div>
      </div>
    </article>
  )
}
