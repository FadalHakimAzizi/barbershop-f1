import Image from 'next/image'
import ScrollReveal from '../scroll-reveal'

const items = [
  { icon: '✂', title: 'Barber Ahli', desc: 'Tim berpengalaman dengan sertifikasi dan jam terbang tinggi.' },
  { icon: '🕒', title: 'Tepat Waktu', desc: 'Sistem booking memastikan kamu dilayani sesuai jadwal.' },
  { icon: '⭐', title: 'Hasil Premium', desc: 'Produk grooming berkualitas untuk hasil yang tahan lama.' },
]

export default function About() {
  return (
    <section
      id="about"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="lp-pad grid-about">
        {/* Photos */}
        <ScrollReveal>
          <div className="grid-photos">
            <div
              className="about-photo-offset"
              style={{ marginTop: 30, position: 'relative', height: 230, borderRadius: 'var(--r-card)', overflow: 'hidden' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80"
                alt="Barber sedang bekerja"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="200px"
              />
            </div>
            <div style={{ position: 'relative', height: 230, borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80"
                alt="Suasana barbershop"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="200px"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={120}>
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
              Tentang Kami
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
              Lebih dari sekadar potong rambut
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.6, marginTop: 14 }}>
              FI Barbershop adalah tempat di mana ketelitian bertemu kenyamanan. Sejak 2018 kami
              merawat ribuan pelanggan dengan satu prinsip: setiap orang berhak tampil terbaik.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 30 }}>
              {items.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 0',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 'var(--r-input)',
                      background: 'var(--surface-2)',
                      color: 'var(--accent)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      fontSize: 22,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: 18,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: 'var(--text)',
                      }}
                    >
                      {title}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.55, marginTop: 4 }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
