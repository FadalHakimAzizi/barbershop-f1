'use client'

import { useEffect } from 'react'

interface ToastProps {
  msg: string
  onDone: () => void
}

export default function Toast({ msg, onDone }: ToastProps) {
  useEffect(() => {
    if (!msg) return
    const id = setTimeout(onDone, 2600)
    return () => clearTimeout(id)
  }, [msg, onDone])

  if (!msg) return null

  return (
    <div
      className="fi-toast"
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
        background: 'var(--ink)',
        color: '#fff',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--r-pill)',
        padding: '13px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
        fontSize: 14.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--ok)' }}>✓</span>
      {msg}
    </div>
  )
}
