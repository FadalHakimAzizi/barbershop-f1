import { createClient } from '@/lib/supabase/server'
import ScrollReveal from '../scroll-reveal'

const FALLBACK = [
  { name: 'Rizky Pratama', service: 'Skin Fade', stars: 5, initials: 'RP', text: 'Hasilnya rapi banget, barbernya juga ramah. Booking online sangat memudahkan, tidak perlu antri lama. Pasti balik lagi!' },
  { name: 'Dani Kurniawan', service: 'Pompadour Cut', stars: 5, initials: 'DK', text: 'Sudah 2 tahun langganan di sini. Kualitasnya konsisten, tempatnya bersih, dan barbernya selalu paham apa yang diinginkan.' },
  { name: 'Arif Hidayat', service: 'Classic + Beard Trim', stars: 5, initials: 'AH', text: 'Harga sebanding dengan kualitas. Beard trim-nya presisi banget. Sistem booking-nya juga sangat mudah dan intuitif.' },
]

interface ReviewRow {
  rating: number
  comment: string
  customer: { name: string } | null
  service: { name: string } | null
}

export default async function Testimonials() {
  let reviews: { name: string; service: string; stars: number; initials: string; text: string }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('rating, comment, customer:profiles!customer_id(name), service:services!service_id(name)')
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(6)

    if (data && data.length > 0) {
      reviews = (data as unknown as ReviewRow[]).map((r) => {
        const name = r.customer?.name || 'Pelanggan'
        return {
          name,
          service: r.service?.name || '—',
          stars: r.rating,
          initials: name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
          text: r.comment || 'Layanan sangat memuaskan!',
        }
      })
    }
  } catch {
    // reviews table may not exist yet
  }

  // use real reviews, pad with fallback entries not already in real list to reach 3
  const items = reviews.length >= 3
    ? reviews.slice(0, 3)
    : [
        ...reviews,
        ...FALLBACK.filter((f) => !reviews.some((r) => r.name === f.name)),
      ].slice(0, 3)

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="lp-pad">
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 50px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>
              ★ Kata Pelanggan
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.01em', textTransform: 'uppercase', margin: '0 0 14px', color: 'var(--text)', lineHeight: 1.05 }}>
              Ribuan Pelanggan Puas
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Kepercayaan pelanggan adalah prioritas utama kami.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid-cards">
          {items.map(({ name, service, stars, initials, text }, i) => (
            <ScrollReveal key={name + i} delay={i * 80}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18, height: '100%' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: j < stars ? 'var(--accent)' : 'var(--border-strong)', fontSize: 17, lineHeight: 1 }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: 15, lineHeight: 1.7, margin: 0, flex: 1, fontStyle: 'italic' }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'color-mix(in oklab, var(--accent) 18%, transparent)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, flexShrink: 0, border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)' }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--text)', letterSpacing: '0.02em' }}>{name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 2 }}>Layanan: {service}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
