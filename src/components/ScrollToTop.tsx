import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Resets the scroll position when navigating to another page. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
