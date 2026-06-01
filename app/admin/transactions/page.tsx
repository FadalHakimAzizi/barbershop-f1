import { createClient } from '@/lib/supabase/server'
import AdminTransactionsClient from '@/components/admin/transactions-client'

export default async function AdminTransactionsPage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      customer:profiles(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 26,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          margin: '0 0 24px',
          color: 'var(--text)',
        }}
      >
        Daftar Transaksi
      </h1>
      <AdminTransactionsClient bookings={bookings || []} />
    </div>
  )
}
