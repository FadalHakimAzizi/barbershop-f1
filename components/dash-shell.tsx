'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo'
import ThemeToggle from './theme-toggle'
import type { Profile } from '@/types'
import { logout } from '@/app/actions/auth'

interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  badge?: number
}

interface DashShellProps {
  user: Profile
  nav: NavItem[]
  children: React.ReactNode
  title?: string
  action?: React.ReactNode
}

export default function DashShell({ user, nav, children, title, action }: DashShellProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
      {/* Sidebar */}
      <aside
        style={{
          background: 'var(--ink)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '26px 24px', borderBottom: '1px solid var(--border)' }}>
          <Logo size={30} light href="/" />
        </div>

        <nav style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/')
            return (
              <Link
                key={n.id}
                href={n.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: '12px 14px',
                  borderRadius: 'var(--r-input)',
                  textDecoration: 'none',
                  background: active
                    ? 'color-mix(in oklab, var(--accent) 16%, transparent)'
                    : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-dim)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14.5,
                  fontWeight: active ? 600 : 500,
                  transition: 'all .15s',
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{ fontSize: 18 }}>{n.icon}</span>
                {n.label}
                {n.badge != null && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 12,
                      fontWeight: 700,
                      background: active ? 'var(--accent)' : 'var(--surface-2)',
                      color: active ? 'var(--accent-ink)' : 'var(--text-dim)',
                      borderRadius: 'var(--r-pill)',
                      padding: '1px 8px',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {n.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 6px 14px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '999px',
                background: 'var(--surface-2)',
                color: 'var(--accent)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {(user.name || '?')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-faint)',
                  textTransform: 'capitalize',
                }}
              >
                {user.role}
              </div>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--r-input)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                cursor: 'pointer',
                width: '100%',
                transition: 'background .15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'var(--surface-2)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'transparent')
              }
            >
              ↩ Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ background: 'var(--bg)', minWidth: 0 }}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            height: 78,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 38px',
            borderBottom: '1px solid var(--border)',
            background: 'color-mix(in oklab, var(--bg) 90%, transparent)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 26,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              margin: 0,
              color: 'var(--text)',
            }}
          >
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {action}
            <ThemeToggle />
          </div>
        </header>
        <div style={{ padding: 38 }}>{children}</div>
      </main>
    </div>
  )
}
