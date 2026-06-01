import { createClient } from '@/lib/supabase/server'
import ServicesSection from './services-section'
import type { ServiceWithCount } from '@/types'

async function getServices(): Promise<ServiceWithCount[]> {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })
  const { data: bookings } = await supabase.from('bookings').select('service_id').neq('status', 'dibatalkan')
  const counts: Record<string, number> = {}
  bookings?.forEach((b) => { counts[b.service_id] = (counts[b.service_id] || 0) + 1 })
  return (services || []).map((s) => ({ ...s, count: counts[s.id] || 0 }))
}

export default async function ServicesData() {
  const services = await getServices()
  return <ServicesSection services={services} />
}
