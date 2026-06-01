'use client'

import Link from 'next/link'
import Logo from '../logo'

const quickLinks = [
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Layanan', href: '#services' },
  { label: 'Rekomendasi', href: '#recommend' },
  { label: 'Kontak', href: '#contact' },
]

const hours = [
  { day: 'Senin – Jumat', time: '09.00 – 21.00 WIB' },
  { day: 'Sabtu – Minggu', time: '08.00 – 22.00 WIB' },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/fibarbershop',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@fibarbershop',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.23 8.23 0 004.84 1.55V7.04a4.85 4.85 0 01-1.07-.35z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6281234567890',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
]

const dimWhite = 'rgba(255,255,255,0.42)'
const mutedWhite = 'rgba(255,255,255,0.22)'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--ink)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 0' }}>
        <div className="grid-footer">

          {/* Brand column */}
          <div>
            <Logo size={34} light />
            <p style={{ color: dimWhite, fontSize: 14, lineHeight: 1.7, marginTop: 18, maxWidth: 260 }}>
              Barbershop premium dengan barber berpengalaman dan sistem booking online yang mudah.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--r-input)',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    color: dimWhite,
                    textDecoration: 'none',
                    transition: 'background .15s, color .15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.14)'
                    el.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.color = dimWhite
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 22 }}>
              Navigasi
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {quickLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ color: dimWhite, fontSize: 14.5, textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = dimWhite)}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 22 }}>
              Jam Operasional
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {hours.map(({ day, time }) => (
                <div key={day}>
                  <div style={{ color: mutedWhite, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{day}</div>
                  <div style={{ color: '#fff', fontSize: 15, marginTop: 4, fontWeight: 500 }}>{time}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                marginTop: 20,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--r-btn)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 6px var(--ok)' }} />
              <span style={{ color: mutedWhite, fontSize: 13 }}>Jl. Merdeka No. 17, Bandung</span>
            </div>
          </div>

          {/* CTA column */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>
              Mulai Booking
            </div>
            <p style={{ color: dimWhite, fontSize: 14, lineHeight: 1.65, margin: '0 0 20px' }}>
              Pesan layanan secara online dan datang tepat waktu sesuai jadwalmu.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link
                href="/register"
                className="btn-accent"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 'var(--r-btn)',
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: 13.5,
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px color-mix(in oklab, var(--accent) 35%, transparent)',
                }}
              >
                📅 Daftar & Booking
              </Link>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 'var(--r-btn)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: dimWhite,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: 13.5,
                  textDecoration: 'none',
                  transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.35)'
                  el.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.15)'
                  el.style.color = dimWhite
                }}
              >
                👤 Sudah Punya Akun
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 48,
            padding: '20px 0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div style={{ color: mutedWhite, fontSize: 13 }}>
            © {year} FI Barbershop. All rights reserved.
          </div>
          <div style={{ color: mutedWhite, fontSize: 13, letterSpacing: '0.06em' }}>
            Sharp · Clean · Classic
          </div>
        </div>
      </div>
    </footer>
  )
}
