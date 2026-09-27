import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router'
import { ScrollToTop } from './ScrollToTop'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const next = i18n.resolvedLanguage === 'es' ? 'en' : 'es'
  return (
    <button
      type="button"
      onClick={() => void i18n.changeLanguage(next)}
      className="rounded-full border border-stone-300 px-3 py-1 text-xs font-bold hover:border-ink"
      title={t('nav.language')}
    >
      {next.toUpperCase()}
    </button>
  )
}

export function Layout({ headerActions }: { headerActions?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8" />
            Shopfront
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium">
            <NavLink to="/" className="hidden hover:underline sm:inline">
              {t('nav.shop')}
            </NavLink>
            {headerActions}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        {t('footer.note')} ·{' '}
        <a className="underline" href="https://github.com/MigueIAngel/shopfront">
          GitHub
        </a>
      </footer>
    </div>
  )
}
