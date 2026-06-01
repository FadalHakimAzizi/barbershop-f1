'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/logo'
import ThemeToggle from '@/components/theme-toggle'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left — full-bleed photo panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80"
          alt="Barbershop"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        {/* dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 100%)',
          }}
        />
        {/* content */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            padding: 56,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Logo size={36} light href="/" />
          </div>
          <div>
            <span style={{ fontSize: 44, color: 'var(--accent)' }}>✂</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 42,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: '#fff',
                margin: '20px 0 0',
              }}
            >
              Tampil Terbaik
              <br />
              Setiap Hari.
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 16,
                lineHeight: 1.65,
                marginTop: 18,
                maxWidth: 380,
              }}
            >
              Masuk untuk memesan layanan, melihat rekomendasi, dan mengelola riwayat bookingmu.
            </p>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            © 2026 FI Barbershop
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* top bar with toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '20px 28px',
          }}
        >
          <ThemeToggle />
        </div>

        {/* centered form */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '0 40px 60px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 400 }}>
            <form onSubmit={handleSubmit}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
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
                Selamat Datang
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
                Masuk
              </h1>
              <p style={{ color: 'var(--text-dim)', fontSize: 15, margin: '0 0 28px' }}>
                Masuk ke akun customer atau admin kamu.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="kamu@mail.com"
                  icon="✉"
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  icon="🔒"
                />

                {error && (
                  <div
                    style={{
                      color: 'var(--danger)',
                      fontSize: 13.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
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
                    transition: 'background .15s',
                  }}
                >
                  {isPending ? 'Memproses...' : 'Masuk →'}
                </button>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: 24,
                  fontSize: 14.5,
                  color: 'var(--text-dim)',
                }}
              >
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Daftar di sini
                </Link>
              </div>
            </form>
          </div>
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
        {icon && (
          <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>{icon}</span>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
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
