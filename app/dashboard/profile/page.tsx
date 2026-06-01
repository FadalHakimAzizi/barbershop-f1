'use client'

import { useState, useTransition, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/app/actions/auth'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setEmail(user.email || '')
      supabase.from('profiles').select('name, phone').eq('id', user.id).single().then(({ data }) => {
        if (data) { setName(data.name || ''); setPhone(data.phone || '') }
      })
    })
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess(false)
    if (!name.trim()) { setError('Nama tidak boleh kosong.'); return }
    startTransition(async () => {
      const res = await updateProfile({ name, phone })
      if (res.error) { setError(res.error); return }
      setSuccess(true)
    })
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 8px', color: 'var(--text)' }}>
        Edit Profil
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: '0 0 28px' }}>Perbarui informasi akun kamu.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Email (read-only) */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>Email</label>
          <input
            type="email" value={email} disabled
            style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '12px 14px', color: 'var(--text-faint)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none', opacity: 0.7, boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 5 }}>Email tidak dapat diubah.</div>
        </div>

        {/* Name */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>Nama Lengkap</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu"
            style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '12px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Phone */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
            Nomor HP <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opsional)</span>
          </label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 812-xxxx-xxxx"
            style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '12px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 5 }}>Berguna untuk reminder via WhatsApp.</div>
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>✕ {error}</div>}
        {success && (
          <div style={{ background: 'color-mix(in oklab, var(--ok) 12%, transparent)', border: '1px solid color-mix(in oklab, var(--ok) 30%, transparent)', borderRadius: 'var(--r-input)', padding: '12px 16px', color: 'var(--ok)', fontSize: 14 }}>
            ✓ Profil berhasil diperbarui.
          </div>
        )}

        <button
          type="submit" disabled={isPending}
          style={{ padding: '13px 24px', borderRadius: 'var(--r-btn)', border: 'none', background: isPending ? 'color-mix(in oklab, var(--accent) 50%, transparent)' : 'var(--accent)', color: 'var(--accent-ink)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isPending ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  )
}
