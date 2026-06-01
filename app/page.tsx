import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/landing/navbar'
import Hero from '@/components/landing/hero'
import About from '@/components/landing/about'
import Testimonials from '@/components/landing/testimonials'
import Contact from '@/components/landing/contact'
import Footer from '@/components/landing/footer'
import ServicesData from '@/components/landing/services-data'
import RecommendData from '@/components/landing/recommend-data'
import ServicesSkeleton from '@/components/landing/services-skeleton'
import RecommendSkeleton from '@/components/landing/recommend-skeleton'

async function getHeroStats() {
  const supabase = await createClient()

  const [{ count: customerCount }, { count: serviceCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('services').select('*', { count: 'exact', head: true }),
  ])

  const { data: reviews } = await supabase.from('reviews').select('rating').then(
    (r) => r,
    () => ({ data: null, error: null })
  )
  const avgRating =
    reviews && reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 4.9

  return {
    customerCount: customerCount ?? 0,
    serviceCount: serviceCount ?? 0,
    avgRating,
  }
}

export default async function HomePage() {
  const { customerCount, serviceCount, avgRating } = await getHeroStats()

  return (
    <div>
      <Navbar />
      <Hero customerCount={customerCount} serviceCount={serviceCount} avgRating={avgRating} />
      <About />
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesData />
      </Suspense>
      <Suspense fallback={<RecommendSkeleton />}>
        <RecommendData />
      </Suspense>
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
