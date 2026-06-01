'use client'

import { useEffect, useState } from 'react'

function setThemeCookie(value: string) {
  document.cookie = `fi-theme=${value}; path=/; max-age=31536000; SameSite=Lax`
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('fi-theme') as 'dark' | 'light' | null
    const initial = stored ?? 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
    setThemeCookie(initial)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('fi-theme', next)
    setThemeCookie(next)
  }

  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--r-pill)',
        border: '1px solid var(--border-strong)',
        background: 'var(--surface-2)',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: 18,
        transition: 'background .15s, border-color .15s',
        flexShrink: 0,
      }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
