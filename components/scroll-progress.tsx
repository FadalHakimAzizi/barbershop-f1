'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      setPct(max > 0 ? (scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        zIndex: 200,
        width: `${pct}%`,
        background: 'var(--accent)',
        boxShadow: '0 0 12px color-mix(in oklab, var(--accent) 70%, transparent)',
        transition: 'width 0.06s linear',
        pointerEvents: 'none',
      }}
    />
  )
}
