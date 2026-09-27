import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { calculateTotals } from '../lib/cart'
import { formatPrice } from '../lib/format'
import { selectCount, useCart } from '../store/cart'

export function CartSummary() {
  const { t, i18n } = useTranslation()
  const items = useCart((state) => state.items)
  const totals = calculateTotals(items)
  const money = (value: number) => formatPrice(value, i18n.resolvedLanguage ?? 'en')

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>{t('cart.subtotal')}</dt>
        <dd>{money(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>{t('cart.shipping')}</dt>
        <dd>{totals.shipping === 0 ? t('cart.free') : money(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>{t('cart.tax')}</dt>
        <dd>{money(totals.tax)}</dd>
      </div>
      <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold">
        <dt>{t('cart.total')}</dt>
        <dd>{money(totals.total)}</dd>
      </div>
      {totals.remainingForFreeShipping > 0 && (
        <p className="rounded-xl bg-accent-50 p-2 text-center text-xs text-accent-700">
          {t('cart.freeShippingHint', { amount: money(totals.remainingForFreeShipping) })}
        </p>
      )}
    </dl>
  )
}

export function CartDrawer() {
  const { t, i18n } = useTranslation()
  const { items, isOpen, close, setQuantity, remove } = useCart()
  const locale = i18n.resolvedLanguage ?? 'en'

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-stone-200 p-5">
          <h2 className="font-display text-2xl">{t('cart.title')}</h2>
          <button type="button" className="text-2xl" onClick={close} aria-label={t('cart.close')}>
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-stone-500">
            <p>{t('cart.empty')}</p>
            <button type="button" className="btn-outline" onClick={close}>
              {t('cart.continue')}
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <img src={item.thumbnail} alt="" className="h-20 w-20 rounded-xl bg-stone-100 object-contain p-1" />
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-stone-300" aria-label={t('cart.quantity')}>
                        <button type="button" className="px-3 py-1" aria-label="-1" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm" data-testid={`qty-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1 disabled:opacity-30"
                          aria-label="+1"
                          disabled={item.quantity >= item.stock}
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity, locale)}</p>
                    </div>
                    <button type="button" className="self-start text-xs text-stone-500 underline" onClick={() => remove(item.id)}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-4 border-t border-stone-200 p-5">
              <CartSummary />
              <Link to="/checkout" className="btn-accent w-full" onClick={close}>
                {t('cart.checkout')}
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export function CartButton() {
  const { t } = useTranslation()
  const open = useCart((state) => state.open)
  const count = useCart(selectCount)
  return (
    <button type="button" className="btn-primary relative px-4 py-2" onClick={open} aria-label={`${t('nav.cart')} (${count})`}>
      🛍 <span className="hidden sm:inline">{t('nav.cart')}</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold">
          {count}
        </span>
      )}
    </button>
  )
}
