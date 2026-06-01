import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatRp } from '@/lib/utils'
import CustomerBookingButton from '@/components/customer/booking-button'
import type { ServiceWithCount } from '@/types'

async function getData(userId: string) {
  const supabase = await createClient()

  const [{ data: bookings }, { data: services }] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, service:services(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false }),
    supabase.from('services').select('*').order('created_at'),
  ])

  const counts: Record<string, number> = {}
  bookings?.forEach((b) => {
    counts[b.service_id] = (counts[b.service_id] || 0) + 1
  })

  const servicesWithCount: ServiceWithCount[] = (services || []).map((s) => ({
    ...s,
    count: counts[s.id] || 0,
  }))

  const recs = [...servicesWithCount]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const upcoming = bookings?.filter(
    (b) => b.status !== 'selesai' && b.status !== 'dibatalkan'
  ).length ?? 0

  const done = bookings?.filter((b) => b.status === 'selesai').length ?? 0

  return { bookings: bookings || [], services: servicesWithCount, recs, upcoming, done }
}

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  const { bookings, services, recs, upcoming, done } = await getData(user.id)

  const stats = [
    { icon: '📅', label: 'Total Booking', value: bookings.length },
    { icon: '🕒', label: 'Akan Datang', value: upcoming },
    { icon: '✓', label: 'Selesai', value: done },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 26,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: 0,
            color: 'var(--text)',
          }}
        >
          Beranda
        </h1>
        <CustomerBookingButton services={services} />
      </div>

      {/* Welcome card */}
      <div
        style={{
          padding: 30,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--ink)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-card)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>Halo,</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 34,
              textTransform: 'uppercase',
              color: '#fff',
              margin: '4px 0 18px',
            }}
          >
            {profile?.name} 👋
          </h2>
          <CustomerBookingButton services={services} primary />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {stats.map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              padding: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
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
                  fontWeight: 700,
                  fontSize: 32,
                  color: 'var(--text)',
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 5 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 22,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              margin: 0,
              color: 'var(--text)',
            }}
          >
            Rekomendasi Untukmu
          </h3>
          <span
            style={{
              display: 'inline-flex',
              background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
              color: 'var(--accent)',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-display)',
            }}
          >
            ⭐ Top 3
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {recs.map((s, i) => (
            <ServiceCardCustomer key={s.id} service={s} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ServiceCardCustomer({ service: s, rank }: { service: ServiceWithCount; rank: number }) {
  const c1 = `oklch(0.42 0.07 ${s.tone})`
  const c2 = `oklch(0.36 0.06 ${s.tone})`
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: 140,
            background: `repeating-linear-gradient(135deg, ${c1} 0 14px, ${c2} 14px 28px)`,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, transparent, color-mix(in oklab, var(--ink) 55%, transparent))',
            }}
          />
        </div>
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span
            style={{
              background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-display)',
            }}
          >
            ★ #{rank}
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--r-pill)',
            padding: '4px 10px',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: '#fff',
            fontSize: 13,
          }}
        >
          {formatRp(s.price)}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 17,
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}
        >
          {s.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 4 }}>
          {s.duration} mnt · {s.count}× dipesan
        </div>
      </div>
    </div>
  )
}
