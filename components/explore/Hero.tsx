import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface ExploreHeroProps {
  totalCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
}

export default function ExploreHero({
  totalCount,
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
}: ExploreHeroProps) {

  return (
    <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Luxury Collection</h1>
          <p className="text-lg text-gray-300 mb-8">Discover over {totalCount.toLocaleString()} verified luxury items from trusted sellers worldwide</p>
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
                type="text"
                placeholder="Search for luxury cars, watches, properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 h-14 text-gray-900 bg-white rounded-lg border-0 shadow-lg focus:shadow-2xl transition-shadow duration-300"
            />
            <Button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 hover:scale-105 transition-all duration-200"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}