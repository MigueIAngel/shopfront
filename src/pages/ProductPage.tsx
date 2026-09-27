import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { fetchProduct } from '../api/products'
import type { Product } from '../api/types'
import { Rating } from '../components/Rating'
import { formatPrice, originalPrice } from '../lib/format'

export function ProductPage({ renderActions }: { renderActions?: (product: Product) => React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const id = Number(useParams().id)
  const product = useQuery({ queryKey: ['product', id], queryFn: ({ signal }) => fetchProduct(id, signal) })
  const [imageIndex, setImageIndex] = useState(0)
  const locale = i18n.resolvedLanguage ?? 'en'

  if (product.isPending) return <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-3xl bg-stone-200 p-4" />
  if (product.isError)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p>{t('product.notFound')}</p>
        <Link to="/" className="underline">← {t('product.back')}</Link>
      </div>
    )

  const p = product.data
  const images = p.images.length ? p.images : [p.thumbnail]
  const stockLabel =
    p.stock === 0 ? t('product.outOfStock') : p.stock < 10 ? t('product.lowStock', { count: p.stock }) : t('product.inStock', { count: p.stock })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/" className="text-sm text-stone-500 hover:underline">← {t('product.back')}</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
            <img src={images[imageIndex]} alt={p.title} className="h-full w-full object-contain p-8" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`h-20 w-20 overflow-hidden rounded-xl bg-white ring-2 ${index === imageIndex ? 'ring-ink' : 'ring-transparent'}`}
                  aria-label={`Image ${index + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-widest text-accent-600 uppercase">{p.brand ?? p.category}</p>
          <h1 className="font-display text-4xl">{p.title}</h1>
          <Rating value={p.rating} />
          <p className="text-3xl font-bold">
            {formatPrice(p.price, locale)}
            {p.discountPercentage >= 5 && (
              <span className="ml-3 text-lg font-normal text-stone-400 line-through">
                {formatPrice(originalPrice(p.price, p.discountPercentage), locale)}
              </span>
            )}
          </p>
          <p className="leading-relaxed text-stone-600">{p.description}</p>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {p.brand && (
              <>
                <dt className="text-stone-500">{t('product.brand')}</dt>
                <dd>{p.brand}</dd>
              </>
            )}
            <dt className="text-stone-500">{t('product.category')}</dt>
            <dd className="capitalize">{p.category.replace('-', ' ')}</dd>
          </dl>
          <p className={p.stock < 10 ? 'text-sm font-semibold text-accent-700' : 'text-sm text-emerald-700'}>{stockLabel}</p>
          <div className="flex gap-3">{renderActions?.(p)}</div>
        </div>
      </div>
    </div>
  )
}
