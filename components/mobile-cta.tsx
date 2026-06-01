'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 320)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (!show) return null

  return (
    <div className="mobile-cta-bar">
      <Link href="/register">📅 Booking Sekarang</Link>
    </div>
  )
}
