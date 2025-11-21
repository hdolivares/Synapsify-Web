import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import FeatureGrid from '@/components/FeatureGrid'
import InteractiveDemo from '@/components/InteractiveDemo'
import PricingSection from '@/components/PricingSection'
import TechSpecs from '@/components/TechSpecs'
import WaitlistSection from '@/components/WaitlistSection'

// Force dynamic rendering to avoid static generation issues on Node v20
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeatureGrid />
      <InteractiveDemo />
      <PricingSection />
      <TechSpecs />
      <WaitlistSection />
      <footer className="py-8 text-center text-foreground-secondary text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} Cortx. All rights reserved.</p>
      </footer>
    </main>
  )
}
