import { useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router'
import type { Product } from './api/types'
import { CartButton, CartDrawer } from './components/CartDrawer'
import { Layout } from './components/Layout'
import { AddToCartButton, WishlistButton } from './components/ProductActions'
import { CatalogPage } from './pages/CatalogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderPage } from './pages/OrderPage'
import { ProductPage } from './pages/ProductPage'
import { WishlistPage } from './pages/WishlistPage'
import { useWishlist } from './store/wishlist'

function HeaderActions() {
  const { t } = useTranslation()
  const saved = useWishlist((state) => state.products.length)
  return (
    <>
      <NavLink to="/wishlist" className="hover:underline">
        ♥ <span className="hidden sm:inline">{t('nav.wishlist')}</span> {saved > 0 && `(${saved})`}
      </NavLink>
      <CartButton />
    </>
  )
}

const cardActions = (product: Product) => (
  <div className="flex gap-2">
    <WishlistButton product={product} />
    <AddToCartButton product={product} compact />
  </div>
)

const detailActions = (product: Product) => (
  <>
    <AddToCartButton product={product} />
    <WishlistButton product={product} />
  </>
)

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout headerActions={<HeaderActions />} />}>
          <Route index element={<CatalogPage renderActions={cardActions} />} />
          <Route path="/products/:id" element={<ProductPage renderActions={detailActions} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
        </Route>
      </Routes>
      <CartDrawer />
    </>
  )
}
