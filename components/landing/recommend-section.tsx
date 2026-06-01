import ServiceCard from '../service-card'
import ScrollReveal from '../scroll-reveal'
import type { ServiceWithCount } from '@/types'

interface Props {
  recs: ServiceWithCount[]
}

export default function RecommendSection({ recs }: Props) {
  return (
    <section id="recommend">
      <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
              marginBottom: 50,
            }}
          >
            <div>
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
                ★ Paling Diminati
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
                Rekomendasi Layanan
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.6, marginTop: 14, maxWidth: 500 }}>
                Dihitung otomatis dari layanan yang paling sering dipesan pelanggan kami.
              </p>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--surface-2)',
                color: 'var(--text-dim)',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '5px 11px',
                borderRadius: 'var(--r-pill)',
                fontFamily: 'var(--font-display)',
                whiteSpace: 'nowrap',
              }}
            >
              📊 Transaction-based
            </span>
          </div>
        </ScrollReveal>

        <div className="grid-cards">
          {recs.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 80}>
              <ServiceCard service={s} rank={i + 1} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
