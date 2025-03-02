import { Hero } from '@/app/components/landing/Hero'
import { Features } from '@/app/components/landing/Features'
import { Pricing } from '@/app/components/landing/Pricing'
import { Testimonials } from '@/app/components/landing/Testimonials'
import { Footer } from '@/app/components/landing/Footer'
import { Navbar } from '@/app/components/landing/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
    </>
  )
}
