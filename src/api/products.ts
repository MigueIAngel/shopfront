import type { CatalogQuery, Category, Product, ProductPage } from './types'

const BASE_URL = 'https://dummyjson.com'
export const PAGE_SIZE = 12

const FIELDS = 'title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,images'

const SORTS: Record<CatalogQuery['sort'], { sortBy?: string; order?: string }> = {
  featured: {},
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  rating: { sortBy: 'rating', order: 'desc' },
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal })
  if (!response.ok) throw new Error(`Request failed with ${response.status}`)
  return response.json() as Promise<T>
}

export function fetchProducts(query: CatalogQuery, signal?: AbortSignal): Promise<ProductPage> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((query.page - 1) * PAGE_SIZE),
    select: FIELDS,
    ...SORTS[query.sort],
  })
  // DummyJSON exposes search and category as separate endpoints.
  let path = '/products'
  if (query.search) {
    path = '/products/search'
    params.set('q', query.search)
  } else if (query.category) {
    path = `/products/category/${encodeURIComponent(query.category)}`
  }
  return request<ProductPage>(`${path}?${params}`, signal)
}

export const fetchProduct = (id: number, signal?: AbortSignal) =>
  request<Product>(`/products/${id}`, signal)

export const fetchCategories = (signal?: AbortSignal) =>
  request<Category[]>('/products/categories', signal)
