'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    name: (formData.get('name') as string).trim(),
    description: (formData.get('description') as string).trim(),
    price: Number(formData.get('price')),
    duration: Number(formData.get('duration')),
    tone: Number(formData.get('tone')),
  }

  if (id) {
    const { error } = await supabase.from('services').update(payload).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('services').insert(payload)
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}
