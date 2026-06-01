import { createClient } from '@/lib/supabase/server'

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

async function getStats() {
  const supabase = await createClient()

  const [
    { count: customerCount },
    { count: serviceCount },
    { count: bookingCount },
    { data: services },
    { data: bookings },
    { data: allBookingsForRevenue },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*').order('created_at'),
    supabase.from('bookings').select('service_id, status, created_at').order('created_at', { ascending: false }),
    supabase.from('bookings').select('status, created_at, service:services(price)').neq('status', 'dibatalkan'),
  ])

  const counts: Record<string, number> = {}
  bookings?.forEach((b) => { counts[b.service_id] = (counts[b.service_id] || 0) + 1 })

  const servicesWithCount = (services || [])
    .map((s) => ({ ...s, count: counts[s.id] || 0 }))
    .sort((a, b) => b.count - a.count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const recs = servicesWithCount.slice(0, 3)
  const topService = recs[0] || null
  const maxCount = Math.max(1, ...servicesWithCount.map((s) => s.count))

  // Revenue stats
  const totalRevenue = (allBookingsForRevenue || []).reduce((sum, b) => {
    const svc = b.service as { price: number } | null
    return sum + Number(svc?.price || 0)
  }, 0)

  // Last 7 days booking trend
  const last7 = getLast7Days()
  const bookingsByDay: Record<string, number> = {}
  last7.forEach((d) => { bookingsByDay[d] = 0 })
  bookings?.forEach((b) => {
    const day = b.created_at.slice(0, 10)
    if (bookingsByDay[day] !== undefined) bookingsByDay[day]++
  })
  const maxDayBookings = Math.max(1, ...Object.values(bookingsByDay))

  // Status breakdown
  const statusCounts = { menunggu: 0, dikonfirmasi: 0, selesai: 0, dibatalkan: 0 }
  bookings?.forEach((b) => {
    if (b.status in statusCounts) statusCounts[b.status as keyof typeof statusCounts]++
  })

  return { customerCount, serviceCount, bookingCount, topService, servicesWithCount, recs, maxCount, totalRevenue, bookingsByDay, last7, maxDayBookings, statusCounts }
}

export default async function AdminDashboard() {
  const { customerCount, serviceCount, bookingCount, topService, servicesWithCount, recs, maxCount, totalRevenue, bookingsByDay, last7, maxDayBookings, statusCounts } = await getStats()

  const stats = [
    { icon: '👤', label: 'Pelanggan', value: customerCount, color: 'var(--info)' },
    { icon: '✂', label: 'Layanan', value: serviceCount, color: 'var(--accent)' },
    { icon: '📅', label: 'Transaksi', value: bookingCount, color: 'var(--ok)' },
    { icon: '💰', label: 'Total Revenue', value: 'Rp ' + Number(totalRevenue).toLocaleString('id-ID'), color: 'var(--warn)', small: true },
  ]

  const statusList = [
    { label: 'Menunggu', count: statusCounts.menunggu, color: 'var(--warn)' },
    { label: 'Dikonfirmasi', count: statusCounts.dikonfirmasi, color: 'var(--info)' },
    { label: 'Selesai', count: statusCounts.selesai, color: 'var(--ok)' },
    { label: 'Dibatalkan', count: statusCounts.dibatalkan, color: 'var(--text-faint)' },
  ]
  const totalForStatus = bookingCount || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
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
        Dashboard Admin
      </h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map(({ icon, label, value, color, small }) => (
          <div
            key={label}
            style={{
              padding: 22,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 'var(--r-input)',
                background: `color-mix(in oklab, ${color} 15%, transparent)`,
                color,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 16,
                fontSize: 22,
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: small ? 22 : 36,
                color: 'var(--text)',
                lineHeight: 1.05,
                textTransform: small ? 'uppercase' : 'none',
                letterSpacing: small ? '0.01em' : 0,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 6, letterSpacing: '0.04em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Booking trend (last 7 days) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--accent)', fontSize: 20 }}>📈</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0, color: 'var(--text)' }}>Tren Booking (7 Hari)</h3>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>Total: {Object.values(bookingsByDay).reduce((a, b) => a + b, 0)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 80 }}>
          {last7.map((day) => {
            const count = bookingsByDay[day] || 0
            const pct = (count / maxDayBookings) * 100
            const label = new Date(day + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short' })
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: count > 0 ? 'var(--text)' : 'var(--text-faint)', fontFamily: 'var(--font-display)' }}>{count || ''}</span>
                <div style={{ width: '100%', background: count > 0 ? 'var(--accent)' : 'var(--surface-2)', borderRadius: '4px 4px 0 0', height: `${Math.max(pct, count > 0 ? 8 : 4)}%`, transition: 'height .3s', minHeight: 4 }} />
                <span style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status breakdown */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ color: 'var(--accent)', fontSize: 20 }}>🗂</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0, color: 'var(--text)' }}>Status Booking</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {statusList.map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 110, fontSize: 13, color: 'var(--text-dim)', flexShrink: 0 }}>{label}</div>
              <div style={{ flex: 1, height: 10, background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
                <div style={{ width: `${(count / Number(totalForStatus)) * 100}%`, height: '100%', background: color, borderRadius: 'var(--r-pill)', minWidth: count ? 6 : 0 }} />
              </div>
              <div style={{ width: 28, textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        {/* Bar chart */}
        <div
          style={{
            padding: 26,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ color: 'var(--accent)', fontSize: 20 }}>📊</span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 19,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: 0,
                color: 'var(--text)',
              }}
            >
              Transaksi per Layanan
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {servicesWithCount.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 130,
                    fontSize: 13.5,
                    color: 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--r-pill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(s.count / maxCount) * 100}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 'var(--r-pill)',
                      transition: 'width .5s',
                      minWidth: s.count ? 6 : 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 24,
                    textAlign: 'right',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--text)',
                  }}
                >
                  {s.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 popular */}
        <div
          style={{
            padding: 26,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ color: 'var(--accent)', fontSize: 20 }}>⭐</span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 19,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: 0,
                color: 'var(--text)',
              }}
            >
              Layanan Populer
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recs.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: 12,
                  borderRadius: 'var(--r-input)',
                  background: 'var(--surface-2)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                    color: i === 0 ? 'var(--accent-ink)' : 'var(--text-dim)',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14.5,
                      color: 'var(--text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    Rp {Number(s.price).toLocaleString('id-ID')}
                  </div>
                </div>
                <span
                  style={{
                    background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                    color: 'var(--accent)',
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--r-pill)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
