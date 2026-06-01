'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setBookingStatus } from '@/app/actions/bookings'
import { formatRp } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'

const STATUSES: BookingStatus[] = ['menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan']

interface Props {
  bookings: Booking[]
}

export default function AdminTransactionsClient({ bookings }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      await setBookingStatus(id, status)
      router.refresh()
    })
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.4fr 1fr 0.8fr 1.2fr',
          gap: 12,
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-display)',
        }}
      >
        <div>Customer</div>
        <div>Layanan</div>
        <div>Tanggal</div>
        <div>Bayar</div>
        <div>Status</div>
      </div>

      {bookings.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)', fontSize: 15 }}>
          Belum ada transaksi.
        </div>
      )}

      {bookings.map((b) => {
        const s = b.service
        const u = b.customer
        return (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.4fr 1fr 0.8fr 1.2fr',
              gap: 12,
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
              fontSize: 14,
            }}
          >
            {/* Customer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  color: 'var(--accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {(u?.name || '?')[0].toUpperCase()}
              </div>
              <span
                style={{
                  color: 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {u?.name || '—'}
              </span>
            </div>

            {/* Service */}
            <div
              style={{
                color: 'var(--text-dim)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {s?.name || '—'}
            </div>

            {/* Date */}
            <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>
              {b.date}
              <span style={{ color: 'var(--text-faint)' }}> · {b.time}</span>
            </div>

            {/* Price */}
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13.5 }}>
              {formatRp(s?.price || 0)}
            </div>

            {/* Status select */}
            <select
              value={b.status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-input)',
                padding: '7px 10px',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize',
                outline: 'none',
              }}
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}
