'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../logo'
import ThemeToggle from '../theme-toggle'
import OpenBadge from '../open-badge'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const NAV_IDS = ['about', 'services', 'recommend', 'contact']
const NAV_LABELS: Record<string, string> = {
  about: 'Tentang',
  services: 'Layanan',
  recommend: 'Rekomendasi',
  contact: 'Kontak',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )
    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const handleNav = (id: string) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  const navLink = (id: string) => (
    <a
      key={id}
      href={`#${id}`}
      onClick={(e) => { e.preventDefault(); handleNav(id) }}
      style={{
        color: active === id ? 'var(--accent)' : 'var(--text-dim)',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: active === id ? 600 : 500,
        letterSpacing: '0.02em',
        transition: 'color .15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { if (active !== id) (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
      onMouseLeave={(e) => { if (active !== id) (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)' }}
    >
      {NAV_LABELS[id]}
    </a>
  )

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled
          ? 'color-mix(in oklab, var(--bg) 88%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition: 'all .3s',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 78,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Logo size={34} />
          <OpenBadge />
        </div>

        {/* Desktop / mobile nav */}
        <nav
          className={`nav-links${menuOpen ? ' is-open' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: 34 }}
        >
          {NAV_IDS.map(navLink)}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <Link
            href="/login"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--r-btn)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 12.5,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background .15s',
            }}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="btn-accent"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--r-btn)',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 12.5,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 2px 10px color-mix(in oklab, var(--accent) 25%, transparent)',
            }}
          >
            📅 Daftar
          </Link>

          {/* Hamburger — only visible on mobile via CSS */}
          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--r-btn)',
              color: 'var(--text)',
              padding: '6px 10px',
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
