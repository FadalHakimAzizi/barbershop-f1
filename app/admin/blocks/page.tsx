import { createClient } from '@/lib/supabase/server'
import BlocksClient from '@/components/admin/blocks-client'

export default async function AdminBlocksPage() {
  const supabase = await createClient()
  const { data: blocks } = await supabase
    .from('blocked_slots')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 6px', color: 'var(--text)' }}>
          Blokir Jadwal
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>
          Blokir tanggal atau jam tertentu agar tidak bisa dipesan customer.
        </p>
      </div>
      <BlocksClient blocks={blocks || []} />
    </div>
  )
}
