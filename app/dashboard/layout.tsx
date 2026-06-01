import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashShell from '@/components/dash-shell'
import type { Profile } from '@/types'

const navItems = [
  { id: 'home', label: 'Beranda', href: '/dashboard', icon: '⊞' },
  { id: 'services', label: 'Layanan', href: '/dashboard/services', icon: '✂' },
  { id: 'history', label: 'Riwayat', href: '/dashboard/history', icon: '≡' },
  { id: 'profile', label: 'Profil', href: '/dashboard/profile', icon: '👤' },
]

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role === 'admin') redirect('/admin')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('customer_id', user.id)

  const nav = navItems.map((n) =>
    n.id === 'history' ? { ...n, badge: bookings?.length ?? 0 } : n
  )

  return (
    <DashShell user={profile as Profile} nav={nav} title="">
      {children}
    </DashShell>
  )
}
