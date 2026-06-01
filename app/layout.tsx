import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import ScrollProgress from '@/components/scroll-progress'
import MobileCta from '@/components/mobile-cta'
import WaButton from '@/components/wa-button'
import PageTransition from '@/components/page-transition'

export const metadata: Metadata = {
  title: 'FI Barbershop — Sharp · Clean · Classic',
  description: 'Booking layanan barbershop premium. Pesan sekarang, datang, dan keluar dengan tampilan terbaik.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('fi-theme')?.value ?? 'dark'

  return (
    <html lang="id" data-theme={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Anton&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollProgress />
        <PageTransition>{children}</PageTransition>
        <WaButton />
        <MobileCta />
      </body>
    </html>
  )
}
