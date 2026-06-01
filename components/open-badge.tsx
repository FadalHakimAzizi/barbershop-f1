'use client'

import { useEffect, useState } from 'react'

function checkOpen() {
  const d = new Date()
  const total = d.getHours() * 60 + d.getMinutes()
  return total >= 9 * 60 && total < 21 * 60
}

export default function OpenBadge() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setOpen(checkOpen())
    setMounted(true)
    const id = setInterval(() => setOpen(checkOpen()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return null

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: open
          ? 'color-mix(in oklab, var(--ok) 14%, transparent)'
          : 'color-mix(in oklab, var(--danger) 12%, transparent)',
        color: open ? 'var(--ok)' : 'var(--danger)',
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        padding: '5px 11px',
        borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: open ? 'var(--ok)' : 'var(--danger)',
          boxShadow: open
            ? '0 0 6px var(--ok)'
            : '0 0 6px var(--danger)',
          flexShrink: 0,
        }}
      />
      {open ? 'Buka Sekarang' : 'Sedang Tutup'}
    </span>
  )
}
