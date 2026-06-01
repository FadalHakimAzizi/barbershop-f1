'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function submitReview(data: {
  bookingId: string
  serviceId: string
  rating: number
  comment: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Verify the booking belongs to this user and is completed
  const { data: booking } = await supabase
    .from('bookings')
    .select('status, customer_id')
    .eq('id', data.bookingId)
    .single()

  if (!booking) return { error: 'Booking tidak ditemukan.' }
  if (booking.customer_id !== user.id) return { error: 'Akses ditolak.' }
  if (booking.status !== 'selesai') return { error: 'Hanya booking selesai yang bisa diulas.' }

  const { error } = await supabase.from('reviews').insert({
    booking_id: data.bookingId,
    customer_id: user.id,
    service_id: data.serviceId,
    rating: data.rating,
    comment: data.comment,
  })
  if (error) return { error: error.message }

  revalidatePath('/dashboard/history')
  revalidatePath('/')
  return { success: true }
}
