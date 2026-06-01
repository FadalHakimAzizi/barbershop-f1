import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HistoryClient from '@/components/customer/history-client'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, service:services(*)')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  // Check which completed bookings have been reviewed
  const completedIds = bookings?.filter((b) => b.status === 'selesai').map((b) => b.id) ?? []
  let reviewedIds: Set<string> = new Set()

  if (completedIds.length > 0) {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('booking_id')
      .in('booking_id', completedIds)
    reviews?.forEach((r) => reviewedIds.add(r.booking_id))
  }

  const bookingsWithReview = (bookings || []).map((b) => ({
    ...b,
    reviewed: reviewedIds.has(b.id),
  }))

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 24px', color: 'var(--text)' }}>
        Riwayat Pemesanan
      </h1>
      <HistoryClient initialBookings={bookingsWithReview} userId={user.id} />
    </div>
  )
}
