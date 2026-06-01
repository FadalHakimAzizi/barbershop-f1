import { createClient } from '@/lib/supabase/server'
import AdminServicesClient from '@/components/admin/services-client'
import type { Service } from '@/types'

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at')

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
          Kelola Layanan
        </h1>
      </div>
      <AdminServicesClient services={(services || []) as Service[]} />
    </div>
  )
}
