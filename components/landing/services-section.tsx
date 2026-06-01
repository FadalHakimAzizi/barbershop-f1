import ServiceCard from '../service-card'
import ScrollReveal from '../scroll-reveal'
import type { ServiceWithCount } from '@/types'

interface Props {
  services: ServiceWithCount[]
}

export default function ServicesSection({ services }: Props) {
  return (
    <section
      id="services"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 50px' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 14,
              }}
            >
              Layanan Kami
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(28px, 4vw, 44px)',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                margin: 0,
                color: 'var(--text)',
                lineHeight: 1.05,
              }}
            >
              Pilih Perawatanmu
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.6, marginTop: 14 }}>
              Dari potongan klasik hingga grooming lengkap — semua dikerjakan dengan presisi.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid-cards">
          {services.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 80}>
              <ServiceCard service={s} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 'var(--r-btn)',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 20px color-mix(in oklab, var(--accent) 35%, transparent)',
              }}
            >
              📅 Daftar & Booking Sekarang
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
