'use client'

import Image from 'next/image'
import Link from 'next/link'
import HeroCounter from './hero-counter'

interface HeroProps {
  customerCount: number
  serviceCount: number
  avgRating: number
}

function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export default function Hero({ customerCount, serviceCount, avgRating }: HeroProps) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 40 }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="lp-hero-pad grid-hero"
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Left */}
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
              color: 'var(--accent)',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              padding: '5px 11px',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-display)',
            }}
          >
            ✂ Barbershop sejak 2018
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(46px, 7vw, 86px)',
              lineHeight: 0.95,
              letterSpacing: '0.005em',
              textTransform: 'uppercase',
              margin: '22px 0 0',
              color: 'var(--text)',
            }}
          >
            Gaya Rapi,
            <br />
            <span style={{ color: 'var(--accent)' }}>Percaya Diri</span>
            <br />
            Maksimal.
          </h1>

          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: 18,
              lineHeight: 1.65,
              maxWidth: 460,
              margin: '26px 0 34px',
            }}
          >
            FI Barbershop menghadirkan potongan presisi dari barber berpengalaman.
            Pesan layananmu secara online, datang, dan keluar dengan tampilan terbaik.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href="/register"
              className="btn-accent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 30px',
                borderRadius: 'var(--r-btn)',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 8px 24px color-mix(in oklab, var(--accent) 45%, transparent)',
              }}
            >
              📅 Booking Sekarang
            </Link>
            <a
              href="#services"
              className="btn-ghost"
              onClick={(e) => { e.preventDefault(); scrollToId('services') }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 30px',
                borderRadius: 'var(--r-btn)',
                border: '1px solid var(--border-strong)',
                background: 'transparent',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: 16,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Lihat Layanan →
            </a>
          </div>

          <HeroCounter customerCount={customerCount} serviceCount={serviceCount} avgRating={avgRating} />
        </div>

        {/* Right — hero image */}
        <div style={{ position: 'relative' }}>
          <div
            className="hero-img"
            style={{
              height: 520,
              borderRadius: 'var(--r-card)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=85"
              alt="Barber sedang memotong rambut pelanggan"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 100%)',
              }}
            />
          </div>

          {/* Floating confirmation card */}
          <div
            className="hero-float"
            style={{
              position: 'absolute',
              bottom: 24,
              left: -28,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
              boxShadow: '0 18px 44px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '999px',
                background: 'color-mix(in oklab, var(--ok) 18%, transparent)',
                color: 'var(--ok)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 20,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                Booking dikonfirmasi
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
                Skin Fade · Hari ini 16:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
