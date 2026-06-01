import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashShell from '@/components/dash-shell'
import type { Profile } from '@/types'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [{ count: serviceCount }, { count: txCount }] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
  ])

  const nav = [
    { id: 'overview', label: 'Dashboard', href: '/admin', icon: '⊞' },
    { id: 'services', label: 'Kelola Layanan', href: '/admin/services', icon: '✂', badge: serviceCount || 0 },
    { id: 'transactions', label: 'Transaksi', href: '/admin/transactions', icon: '≡', badge: txCount || 0 },
    { id: 'blocks', label: 'Blokir Jadwal', href: '/admin/blocks', icon: '🚫' },
  ]

  return (
    <DashShell user={profile as Profile} nav={nav}>
      {children}
    </DashShell>
  )
}
