'use client'

import { useState } from 'react'
import BookingModal from './booking-modal'
import type { ServiceWithCount } from '@/types'

interface Props {
  services: ServiceWithCount[]
  primary?: boolean
}

export default function CustomerBookingButton({ services, primary }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: primary ? '12px 22px' : '8px 16px',
          borderRadius: 'var(--r-btn)',
          border: 'none',
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: primary ? 15 : 12.5,
          cursor: 'pointer',
          boxShadow: '0 2px 10px color-mix(in oklab, var(--accent) 25%, transparent)',
        }}
      >
        📅 {primary ? 'Booking Layanan Baru' : 'Booking'}
      </button>

      {open && (
        <BookingModal
          services={services}
          onClose={() => setOpen(false)}
          onDone={() => setOpen(false)}
        />
      )}
    </>
  )
}
