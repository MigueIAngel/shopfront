import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { PAGE_SIZE, fetchCategories, fetchProducts } from '../api/products'
import type { CatalogQuery, Product, SortOption } from '../api/types'
import { ProductCard } from '../components/ProductCard'
import { useDebouncedValue } from '../lib/useDebouncedValue'

const SORTS: SortOption[] = ['featured', 'price-asc', 'price-desc', 'rating']

function readQuery(params: URLSearchParams): CatalogQuery {
  const sort = params.get('sort') as SortOption | null
  return {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: sort && SORTS.includes(sort) ? sort : 'featured',
    page: Math.max(1, Number(params.get('page')) || 1),
  }
}

export function CatalogPage({ renderActions }: { renderActions?: (product: Product) => React.ReactNode }) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const query = readQuery(params)
  const [searchInput, setSearchInput] = useState(query.search)
  const debouncedSearch = useDebouncedValue(searchInput)

  // Catalog state lives in the URL so filters are shareable and survive reloads.
  function update(changes: Partial<CatalogQuery>) {
    const next = { ...query, page: 1, ...changes }
    const search = new URLSearchParams()
    if (next.search) search.set('q', next.search)
    if (next.category && !next.search) search.set('category', next.category)
    if (next.sort !== 'featured') search.set('sort', next.sort)
    if (next.page > 1) search.set('page', String(next.page))
    setParams(search, { replace: true })
  }

  useEffect(() => {
    if (debouncedSearch !== query.search) update({ search: debouncedSearch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const categories = useQuery({ queryKey: ['categories'], queryFn: ({ signal }) => fetchCategories(signal), staleTime: Infinity })
  const products = useQuery({
    queryKey: ['products', query],
    queryFn: ({ signal }) => fetchProducts(query, signal),
    placeholderData: keepPreviousData,
  })

  const pages = products.data ? Math.max(1, Math.ceil(products.data.total / PAGE_SIZE)) : 1

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8">
        <p className="text-sm font-semibold tracking-widest text-accent-600 uppercase">{t('hero.eyebrow')}</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">{t('hero.title')}</h1>
        <p className="mt-4 max-w-xl text-lg text-stone-600">{t('hero.subtitle')}</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="search"
            className="field md:max-w-sm"
            placeholder={t('catalog.search')}
            aria-label={t('catalog.search')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select
            className="field md:w-56"
            aria-label={t('catalog.allCategories')}
            value={query.category}
            disabled={Boolean(query.search)}
            onChange={(event) => update({ category: event.target.value })}
          >
            <option value="">{t('catalog.allCategories')}</option>
            {categories.data?.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="field md:w-56"
            aria-label={t('catalog.sort')}
            value={query.sort}
            onChange={(event) => update({ sort: event.target.value as SortOption })}
          >
            {SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {t(`catalog.sorts.${sort}`)}
              </option>
            ))}
          </select>
          {products.data && (
            <p className="text-sm text-stone-500 md:ml-auto">
              {t('catalog.results', { count: products.data.total })}
            </p>
          )}
        </div>

        {products.isPending && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-stone-200" />
            ))}
          </div>
        )}
        {products.isError && <p className="text-rose-600">{String(products.error)}</p>}
        {products.data?.products.length === 0 && <p className="py-16 text-center text-stone-500">{t('catalog.empty')}</p>}

        <div
          className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${products.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          {products.data?.products.map((product) => (
            <ProductCard key={product.id} product={product} actions={renderActions?.(product)} />
          ))}
        </div>

        {pages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
            <button type="button" className="btn-outline" disabled={query.page <= 1} onClick={() => update({ page: query.page - 1 })}>
              ← {t('catalog.previous')}
            </button>
            <span className="text-sm text-stone-600">{t('catalog.page', { page: query.page, pages })}</span>
            <button type="button" className="btn-outline" disabled={query.page >= pages} onClick={() => update({ page: query.page + 1 })}>
              {t('catalog.next')} →
            </button>
          </nav>
        )}
      </section>
    </>
  )
}
