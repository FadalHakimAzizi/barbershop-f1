'use client'

import { useState, useTransition } from 'react'
import { cancelBooking } from '@/app/actions/bookings'

export default function CancelBookingButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [err, setErr] = useState('')

  function handleCancel() {
    startTransition(async () => {
      const res = await cancelBooking(id)
      if (res.error) { setErr(res.error); setConfirm(false) }
    })
  }

  if (confirm) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {err && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{err}</span>}
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Batalkan?</span>
        <button
          onClick={handleCancel}
          disabled={isPending}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--r-btn)',
            border: 'none',
            background: 'var(--danger)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? '...' : 'Ya'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--r-btn)',
            border: '1px solid var(--border-strong)',
            background: 'transparent',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Tidak
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      style={{
        padding: '5px 12px',
        borderRadius: 'var(--r-btn)',
        border: '1px solid color-mix(in oklab, var(--danger) 40%, transparent)',
        background: 'color-mix(in oklab, var(--danger) 10%, transparent)',
        color: 'var(--danger)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      Batalkan
    </button>
  )
}
