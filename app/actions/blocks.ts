'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addBlockedSlot(data: {
  date: string
  time: string | null
  reason: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('blocked_slots').insert({
    date: data.date,
    time: data.time,
    reason: data.reason,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/blocks')
  return { success: true }
}

export async function removeBlockedSlot(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blocked_slots').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/blocks')
  return { success: true }
}
