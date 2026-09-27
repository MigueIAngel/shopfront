import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Route>
    </Routes>
  )
}
