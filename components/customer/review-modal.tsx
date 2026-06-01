'use client'

import { useState, useTransition } from 'react'
import { submitReview } from '@/app/actions/reviews'

interface Props {
  bookingId: string
  serviceId: string
  serviceName: string
  onDone: () => void
}

export default function ReviewModal({ bookingId, serviceId, serviceName, onDone }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (rating === 0) { setError('Pilih rating bintang terlebih dahulu.'); return }
    startTransition(async () => {
      const res = await submitReview({ bookingId, serviceId, rating, comment })
      if (res.error) { setError(res.error); return }
      onDone()
    })
  }

  return (
    <div
      className="fi-fade"
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-card)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, textTransform: 'uppercase', color: 'var(--text)' }}>
              Beri Ulasan
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 3 }}>{serviceName}</div>
          </div>
          <button onClick={onDone} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 16 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stars */}
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>Rating</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: n <= (hovered || rating) ? 'var(--accent)' : 'var(--border-strong)',
                    transition: 'color .1s, transform .1s',
                    transform: n <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--accent)', marginTop: 6, fontWeight: 600 }}>
                {['', 'Sangat Buruk', 'Kurang Memuaskan', 'Cukup Baik', 'Sangat Baik', 'Luar Biasa!'][rating]}
              </div>
            )}
          </div>

          {/* Comment */}
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
              Komentar <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opsional)</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalamanmu..."
              rows={3}
              style={{
                width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-input)', padding: '12px 14px', color: 'var(--text)',
                fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>✕ {error}</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onDone} style={{ padding: '10px 18px', borderRadius: 'var(--r-btn)', border: 'none', background: 'transparent', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Lewati
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
            style={{
              padding: '10px 20px', borderRadius: 'var(--r-btn)', border: 'none',
              background: isPending || rating === 0 ? 'color-mix(in oklab, var(--accent) 40%, transparent)' : 'var(--accent)',
              color: 'var(--accent-ink)', fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: isPending || rating === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Mengirim...' : '★ Kirim Ulasan'}
          </button>
        </div>
      </div>
    </div>
  )
}
