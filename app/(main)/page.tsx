// app/page.tsx
import { HeroSection } from '@/components/home/hero-section'
import { ExploreMarketplace } from '@/components/home/explore-marketplace'
import { ExploreItems } from '@/components/home/explore-items'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreMarketplace />
      <ExploreItems />
    </div>
  )
}