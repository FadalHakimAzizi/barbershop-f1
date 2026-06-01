import { createClient } from '@/lib/supabase/server'
import RecommendSection from './recommend-section'
import type { ServiceWithCount } from '@/types'

async function getRecs(): Promise<ServiceWithCount[]> {
  const supabase = await createClient()
  const { data: services } = await supabase.from('services').select('*')
  const { data: bookings } = await supabase
    .from('bookings')
    .select('service_id')
    .neq('status', 'dibatalkan')

  const counts: Record<string, number> = {}
  bookings?.forEach((b) => { counts[b.service_id] = (counts[b.service_id] || 0) + 1 })

  return (services || [])
    .map((s) => ({ ...s, count: counts[s.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

export default async function RecommendData() {
  const recs = await getRecs()
  return <RecommendSection recs={recs} />
}
