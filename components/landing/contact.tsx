import ScrollReveal from '../scroll-reveal'

const contactItems = [
  { icon: '📍', label: 'Alamat', value: 'Jl. Merdeka No. 17, Bandung, Jawa Barat 40115' },
  { icon: '📞', label: 'Telepon', value: '+62 812-3456-7890' },
  { icon: '✉', label: 'Email', value: 'halo@fibarbershop.id' },
  { icon: '🕒', label: 'Jam Buka', value: 'Setiap hari · 09.00 – 21.00 WIB' },
]

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid-contact">
          <ScrollReveal>
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
                Kunjungi Kami
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                  margin: '0 0 32px',
                  color: 'var(--text)',
                  lineHeight: 1.05,
                }}
              >
                Lokasi & Kontak
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {contactItems.map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--r-input)',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
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
                          fontSize: 12.5,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--text-faint)',
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ color: 'var(--text)', fontSize: 16, marginTop: 3 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Google Maps embed */}
          <ScrollReveal delay={100}>
            <div
              style={{
                height: 400,
                borderRadius: 'var(--r-card)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Jalan+Merdeka+Bandung+Jawa+Barat+Indonesia&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi FI Barbershop"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
