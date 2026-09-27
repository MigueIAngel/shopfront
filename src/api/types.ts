export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
}

export interface ProductPage {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface Category {
  slug: string
  name: string
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export interface CatalogQuery {
  search: string
  category: string
  sort: SortOption
  page: number
}
