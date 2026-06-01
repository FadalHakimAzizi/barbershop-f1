'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetHeight // force reflow to re-trigger animation
    el.style.animation = ''
  }, [pathname])

  return (
    <div ref={ref} className="page-fade">
      {children}
    </div>
  )
}
