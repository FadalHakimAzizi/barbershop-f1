'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendBookingConfirmation } from '@/lib/email'
import { MAX_SLOT_CAPACITY } from '@/lib/constants'
import type { BookingStatus } from '@/types'

export async function createBooking(data: {
  serviceIds: string[]
  date: string
  time: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu.' }

  // Check slot capacity
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('date', data.date)
    .eq('time', data.time)
    .neq('status', 'dibatalkan')

  if ((count ?? 0) + data.serviceIds.length > MAX_SLOT_CAPACITY) {
    return { error: `Slot ${data.time} sudah penuh. Pilih jam lain.` }
  }

  // Check blocked slots
  const { data: blocked } = await supabase
    .from('blocked_slots')
    .select('id')
    .eq('date', data.date)
    .or(`time.is.null,time.eq.${data.time}`)
    .limit(1)

  if (blocked && blocked.length > 0) {
    return { error: 'Tanggal/jam ini tidak tersedia. Silakan pilih waktu lain.' }
  }

  const rows = data.serviceIds.map((serviceId) => ({
    customer_id: user.id,
    service_id: serviceId,
    date: data.date,
    time: data.time,
    status: 'menunggu' as const,
  }))

  const { error } = await supabase.from('bookings').insert(rows)
  if (error) return { error: error.message }

  // Send confirmation email (non-blocking)
  try {
    const { data: services } = await supabase
      .from('services')
      .select('name, price')
      .in('id', data.serviceIds)

    await sendBookingConfirmation({
      to: user.email!,
      date: data.date,
      time: data.time,
      services: services?.map((s) => ({ name: s.name, price: Number(s.price) })) ?? [],
    })
  } catch {
    // Email failure should not block booking
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  revalidatePath('/admin/transactions')
  return { success: true }
}

export async function cancelBooking(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Only allow cancel if status = menunggu AND owned by this customer
  const { data: booking } = await supabase
    .from('bookings')
    .select('status, customer_id')
    .eq('id', id)
    .single()

  if (!booking) return { error: 'Booking tidak ditemukan.' }
  if (booking.customer_id !== user.id) return { error: 'Akses ditolak.' }
  if (booking.status !== 'menunggu') return { error: 'Hanya booking dengan status Menunggu yang bisa dibatalkan.' }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'dibatalkan' })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/history')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getSlotOccupancy(date: string): Promise<Record<string, number>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', date)
    .neq('status', 'dibatalkan')

  const counts: Record<string, number> = {}
  data?.forEach((b) => { counts[b.time] = (counts[b.time] || 0) + 1 })
  return counts
}

export async function getBlockedSlots(date: string): Promise<{ times: string[]; dayReason: string }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blocked_slots')
    .select('time, reason')
    .eq('date', date)

  if (!data || data.length === 0) return { times: [], dayReason: '' }

  const dayBlock = data.find((r) => r.time === null)
  if (dayBlock) return { times: ['ALL'], dayReason: dayBlock.reason || '' }

  return { times: data.map((r) => r.time as string), dayReason: '' }
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}
