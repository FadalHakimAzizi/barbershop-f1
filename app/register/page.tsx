'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Logo from '@/components/logo'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    if (password.length < 4) {
      setError('Password minimal 4 karakter.')
      return
    }
    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left brand panel */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--ink)',
          borderRight: '1px solid var(--border)',
          padding: 56,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(135deg, transparent 0 22px, color-mix(in oklab, var(--accent) 5%, transparent) 22px 44px)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <Logo size={36} light href="/" />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 40, color: 'var(--accent)' }}>✂</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1,
              textTransform: 'uppercase',
              color: '#fff',
              margin: '20px 0 0',
            }}
          >
            Bergabung
            <br />
            Bersama Kami.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6, marginTop: 18, maxWidth: 380 }}>
            Buat akun untuk mulai memesan layanan barbershop premium kami.
          </p>
        </div>
        <div style={{ position: 'relative', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          © 2026 FI Barbershop
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: 40,
          background: 'var(--bg)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <form onSubmit={handleSubmit}>
            <span
              style={{
                display: 'inline-flex',
                background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                color: 'var(--accent)',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '5px 11px',
                borderRadius: 'var(--r-pill)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Member Baru
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 36,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                margin: '16px 0 8px',
                color: 'var(--text)',
              }}
            >
              Daftar
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 15, margin: '0 0 28px' }}>
              Buat akun untuk mulai memesan layanan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <InputField label="Nama Lengkap" name="name" placeholder="Nama kamu" icon="👤" />
              <InputField label="Email" name="email" type="email" placeholder="kamu@mail.com" icon="✉" />
              <InputField label="Password" name="password" type="password" placeholder="Minimal 4 karakter" icon="🔒" />

              {error && (
                <div style={{ color: 'var(--danger)', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>
                  ✕ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '16px 30px',
                  borderRadius: 'var(--r-btn)',
                  border: 'none',
                  background: isPending
                    ? 'color-mix(in oklab, var(--accent) 60%, transparent)'
                    : 'var(--accent)',
                  color: 'var(--accent-ink)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: 16,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {isPending ? 'Memproses...' : 'Buat Akun →'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14.5, color: 'var(--text-dim)' }}>
              Sudah punya akun?{' '}
              <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Masuk
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  icon,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  icon?: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <label style={{ display: 'block' }}>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface-2)',
          border: `1px solid ${focus ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--r-input)',
          padding: '0 14px',
          transition: 'border-color .15s',
          boxShadow: focus ? '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)' : 'none',
        }}
      >
        {icon && <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>{icon}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            padding: '13px 0',
          }}
        />
      </div>
    </label>
  )
}
