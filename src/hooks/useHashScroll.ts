import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useHashScroll() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      return
    }

    const id = hash.slice(1)
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id)
      target?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [hash, pathname])
}
