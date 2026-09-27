import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'
import { CartSummary } from '../components/CartDrawer'
import { calculateTotals } from '../lib/cart'
import { type CheckoutData, type CheckoutInput, checkoutSchema } from '../lib/checkoutSchema'
import { formatPrice } from '../lib/format'
import { createOrderId } from '../lib/order'
import { useCart } from '../store/cart'

const COUNTRIES = ['Colombia', 'Mexico', 'Spain', 'United States', 'Argentina', 'Chile', 'Peru']

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-rose-600">{t(error)}</span>}
    </label>
  )
}

export function CheckoutPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, clear } = useCart()
  const totals = calculateTotals(items)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput, unknown, CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'Colombia' },
  })

  if (items.length === 0 && !isSubmitting) return <Navigate to="/" replace />

  async function onSubmit(data: CheckoutData) {
    // Simulated payment request.
    await new Promise((resolve) => setTimeout(resolve, 900))
    const orderId = createOrderId()
    clear()
    navigate(`/order/${orderId}`, { state: { email: data.email, total: totals.total } })
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <h1 className="font-display text-4xl">{t('checkout.title')}</h1>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-lg font-semibold">{t('checkout.contact')}</legend>
          <Field label={t('checkout.email')} error={errors.email?.message}>
            <input className="field" type="email" autoComplete="email" {...register('email')} />
          </Field>
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 text-lg font-semibold">{t('checkout.shippingAddress')}</legend>
          <Field label={t('checkout.fullName')} error={errors.fullName?.message} className="sm:col-span-2">
            <input className="field" autoComplete="name" {...register('fullName')} />
          </Field>
          <Field label={t('checkout.address')} error={errors.address?.message} className="sm:col-span-2">
            <input className="field" autoComplete="street-address" {...register('address')} />
          </Field>
          <Field label={t('checkout.city')} error={errors.city?.message}>
            <input className="field" autoComplete="address-level2" {...register('city')} />
          </Field>
          <Field label={t('checkout.postalCode')} error={errors.postalCode?.message}>
            <input className="field" autoComplete="postal-code" {...register('postalCode')} />
          </Field>
          <Field label={t('checkout.country')} error={errors.country?.message} className="sm:col-span-2">
            <select className="field" {...register('country')}>
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </Field>
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-4">
          <legend className="mb-2 text-lg font-semibold">{t('checkout.payment')}</legend>
          <p className="rounded-xl bg-accent-50 p-3 text-sm text-accent-700 sm:col-span-4">{t('checkout.demoNotice')}</p>
          <Field label={t('checkout.cardNumber')} error={errors.cardNumber?.message} className="sm:col-span-2">
            <input className="field" inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="off" {...register('cardNumber')} />
          </Field>
          <Field label={t('checkout.expiry')} error={errors.expiry?.message}>
            <input className="field" placeholder="12/30" autoComplete="off" {...register('expiry')} />
          </Field>
          <Field label={t('checkout.cvc')} error={errors.cvc?.message}>
            <input className="field" inputMode="numeric" placeholder="123" autoComplete="off" {...register('cvc')} />
          </Field>
        </fieldset>

        <button type="submit" className="btn-accent w-full py-3 text-base" disabled={isSubmitting}>
          {isSubmitting
            ? t('checkout.processing')
            : t('checkout.placeOrder', { total: formatPrice(totals.total, i18n.resolvedLanguage ?? 'en') })}
        </button>
      </form>

      <aside className="h-fit space-y-4 rounded-3xl bg-white p-6 ring-1 ring-stone-200 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">{t('checkout.summary')}</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <img src={item.thumbnail} alt="" className="h-12 w-12 rounded-lg bg-stone-100 object-contain" />
              <span className="flex-1 line-clamp-2">
                {item.title} × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <CartSummary />
      </aside>
    </div>
  )
}
