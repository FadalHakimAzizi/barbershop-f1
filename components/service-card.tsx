'use client'

import type { ServiceWithCount } from '@/types'
import { formatRp } from '@/lib/utils'

interface ServiceCardProps {
  service: ServiceWithCount
  rank?: number
  onBook?: (service: ServiceWithCount) => void
  compact?: boolean
}

// Curated barbershop photos — cycled by service tone hue
const PHOTOS = [
  'photo-1503951914875-452162b0f3f1', // classic haircut
  'photo-1599351431202-1e0f0137899a', // barber styling
  'photo-1622288432450-277d0fef5ed6', // modern cut
  'photo-1621605815971-fbc98d665033', // scissors & tools
  'photo-1595476108010-b4d1f102b1b1', // beard trim
  'photo-1604654894610-df63bc536371', // barber at work
]

function photoUrl(tone: number) {
  const idx = Math.round(tone / 60) % PHOTOS.length
  return `https://images.unsplash.com/${PHOTOS[idx]}?auto=format&fit=crop&w=600&q=80`
}

export default function ServiceCard({ service: s, rank, onBook, compact }: ServiceCardProps) {
  return (
    <div
      className="service-card"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* image area */}
      <div style={{ position: 'relative', height: compact ? 150 : 184, flexShrink: 0, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="card-img"
          src={photoUrl(s.tone)}
          alt={s.name}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* subtle darkening overlay so badges stay readable */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.48) 100%)',
          }}
        />

        {rank != null && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                color: 'var(--accent)',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '5px 11px',
                borderRadius: 'var(--r-pill)',
                fontFamily: 'var(--font-display)',
                backdropFilter: 'blur(6px)',
              }}
            >
              ★ #{rank} Populer
            </span>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--r-pill)',
            padding: '5px 12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: '#fff',
            fontSize: 14,
            letterSpacing: '0.02em',
          }}
        >
          {formatRp(s.price)}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 21,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: 0,
            color: 'var(--text)',
          }}
        >
          {s.name}
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.55, margin: 0, flex: 1 }}>
          {s.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-faint)', fontSize: 13 }}>
          <span>🕒</span> {s.duration} menit
          {s.count > 0 && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              📊 {s.count}× dipesan
            </span>
          )}
        </div>
        {onBook && (
          <button
            onClick={() => onBook(s)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 'var(--r-btn)',
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 12.5,
              cursor: 'pointer',
              width: '100%',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
          >
            Pesan Sekarang →
          </button>
        )}
      </div>
    </div>
  )
}
