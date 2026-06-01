import { createClient } from '@/lib/supabase/server'
import ServiceCard from '@/components/service-card'
import CustomerBookingButton from '@/components/customer/booking-button'
import type { ServiceWithCount } from '@/types'

export default async function CustomerServicesPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: bookings }] = await Promise.all([
    supabase.from('services').select('*').order('created_at'),
    supabase.from('bookings').select('service_id'),
  ])

  const counts: Record<string, number> = {}
  bookings?.forEach((b) => { counts[b.service_id] = (counts[b.service_id] || 0) + 1 })

  const servicesWithCount: ServiceWithCount[] = (services || []).map((s) => ({
    ...s,
    count: counts[s.id] || 0,
  }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
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
          Semua Layanan
        </h1>
        <CustomerBookingButton services={servicesWithCount} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {servicesWithCount.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  )
}
