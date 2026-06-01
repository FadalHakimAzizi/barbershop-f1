'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  raw: number
  format: (n: number) => string
  label: string
}

function buildStats(customerCount: number, serviceCount: number, avgRating: number): StatItem[] {
  return [
    {
      raw: customerCount,
      format: customerCount >= 1000
        ? (n) => `${Math.floor(n / 1000)}K+`
        : (n) => String(n),
      label: 'Pelanggan',
    },
    {
      raw: serviceCount,
      format: (n) => String(n),
      label: 'Layanan',
    },
    {
      raw: Math.round(avgRating * 10),
      format: (n) => (n / 10).toFixed(1),
      label: 'Rating',
    },
  ]
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return val
}

function Counter({ raw, format, label }: StatItem) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const val = useCountUp(raw, 1800, active)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: 'var(--text)', lineHeight: 1 }}>
        {format(val)}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.04em', marginTop: 6 }}>
        {label}
      </div>
    </div>
  )
}

interface Props {
  customerCount: number
  serviceCount: number
  avgRating: number
}

export default function HeroCounter({ customerCount, serviceCount, avgRating }: Props) {
  const stats = buildStats(customerCount, serviceCount, avgRating)
  return (
    <div style={{ display: 'flex', gap: 38, marginTop: 50 }}>
      {stats.map((s) => <Counter key={s.label} {...s} />)}
    </div>
  )
}
