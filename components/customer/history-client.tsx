'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRp, statusTone } from '@/lib/utils'
import CancelBookingButton from './cancel-booking-button'
import ReviewModal from './review-modal'
import type { Booking } from '@/types'

const toneColors: Record<string, string> = {
  green: 'var(--ok)',
  blue: 'var(--info)',
  amber: 'var(--warn)',
  neutral: 'var(--text-faint)',
}

interface Props {
  initialBookings: (Booking & { reviewed?: boolean })[]
  userId: string
}

export default function HistoryClient({ initialBookings, userId }: Props) {
  const [bookings, setBookings] = useState(initialBookings)
  const [reviewing, setReviewing] = useState<Booking | null>(null)

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('customer-bookings')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `customer_id=eq.${userId}` },
        (payload) => {
          setBookings((prev) =>
            prev.map((b) => (b.id === payload.new.id ? { ...b, ...payload.new } : b))
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  if (bookings.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-dim)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
        <div style={{ fontSize: 16 }}>Belum ada riwayat booking.</div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map((b) => {
          const s = b.service
          const c1 = `oklch(0.42 0.07 ${s?.tone || 30})`
          const c2 = `oklch(0.36 0.06 ${s?.tone || 30})`
          const tone = statusTone(b.status)
          const statusColor = toneColors[tone] || toneColors.neutral
          const canCancel = b.status === 'menunggu'
          const canReview = b.status === 'selesai' && !b.reviewed

          return (
            <div
              key={b.id}
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-card)',
                flexWrap: 'wrap',
              }}
            >
              {/* Service thumbnail */}
              <div style={{ width: 60, height: 60, borderRadius: 10, flexShrink: 0, background: `repeating-linear-gradient(135deg, ${c1} 0 10px, ${c2} 10px 20px)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent, color-mix(in oklab, var(--ink) 55%, transparent))' }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textTransform: 'uppercase', color: 'var(--text)' }}>
                  {s?.name || '—'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span>📅 {b.date}</span>
                  <span>🕒 {b.time}</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)', fontSize: 15 }}>
                {formatRp(Number(s?.price) || 0)}
              </div>

              {/* Status badge */}
              <span style={{
                display: 'inline-flex',
                background: `color-mix(in oklab, ${statusColor} 16%, transparent)`,
                color: statusColor,
                fontSize: 11.5, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', padding: '5px 11px',
                borderRadius: 'var(--r-pill)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
              }}>
                {b.status}
              </span>

              {/* Actions */}
              {canCancel && <CancelBookingButton id={b.id} />}
              {canReview && (
                <button
                  onClick={() => setReviewing(b)}
                  style={{
                    padding: '5px 12px', borderRadius: 'var(--r-btn)',
                    border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
                    background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                    color: 'var(--accent)', fontFamily: 'var(--font-display)',
                    fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  ★ Beri Ulasan
                </button>
              )}
              {b.status === 'selesai' && b.reviewed && (
                <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600 }}>✓ Diulas</span>
              )}
            </div>
          )
        })}
      </div>

      {reviewing && reviewing.service && (
        <ReviewModal
          bookingId={reviewing.id}
          serviceId={reviewing.service_id}
          serviceName={reviewing.service?.name || ''}
          onDone={() => {
            setBookings((prev) => prev.map((b) => b.id === reviewing.id ? { ...b, reviewed: true } : b))
            setReviewing(null)
          }}
        />
      )}
    </>
  )
}
