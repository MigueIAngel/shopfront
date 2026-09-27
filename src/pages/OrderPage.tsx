import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router'
import { formatPrice } from '../lib/format'

export function OrderPage() {
  const { t, i18n } = useTranslation()
  const { orderId } = useParams()
  const state = useLocation().state as { email?: string; total?: number } | null

  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div>
      <h1 className="font-display text-4xl">{t('order.title')}</h1>
      <p className="mt-4 text-stone-600">
        {t('order.number')}: <strong>{orderId}</strong>
        {state?.total !== undefined && <> · {formatPrice(state.total, i18n.resolvedLanguage ?? 'en')}</>}
      </p>
      {state?.email && <p className="mt-2 text-stone-600">{t('order.confirmation', { email: state.email })}</p>}
      <Link to="/" className="btn-primary mt-8">
        {t('order.backToShop')}
      </Link>
    </section>
  )
}
