
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Search } from 'lucide-react';

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  loadAllProducts: () => void;
  loading: boolean;
  showSearch?: boolean;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({
  title,
  subtitle,
  searchQuery,
  setSearchQuery,
  loadAllProducts,
  loading,
  showSearch = true,
}) => {
  return (
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {subtitle && <p className="text-lg text-gray-300 mb-8">{subtitle}</p>}
            {/* Search */}
            {showSearch && (
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search within this category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadAllProducts()}
                  className="w-full pl-12 pr-4 py-3 h-14 text-gray-900 bg-white rounded-lg border-0 shadow-lg focus:shadow-2xl transition-shadow duration-300"
                />
                <Button
                  onClick={loadAllProducts}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
  );
};

export default CategoryHero;