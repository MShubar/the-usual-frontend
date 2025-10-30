import { useEffect, useRef } from 'react'

export const useScrollRefresh = (onRefresh) => {
  const containerRef = useRef(null)
  const lastScrollTop = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop
          if (scrollTop <= 0 && lastScrollTop.current > 10) {
            onRefresh()
          }
          lastScrollTop.current = scrollTop
          ticking = false
        })
        ticking = true
      }
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [onRefresh])

  return containerRef
}
