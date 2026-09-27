import { useTranslation } from 'react-i18next'
import { AddToCartButton, WishlistButton } from '../components/ProductActions'
import { ProductCard } from '../components/ProductCard'
import { useWishlist } from '../store/wishlist'

export function WishlistPage() {
  const { t } = useTranslation()
  const products = useWishlist((state) => state.products)
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 font-display text-4xl">{t('wishlist.title')}</h1>
      {products.length === 0 ? (
        <p className="text-stone-500">{t('wishlist.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actions={
                <div className="flex gap-2">
                  <WishlistButton product={product} />
                  <AddToCartButton product={product} compact />
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
