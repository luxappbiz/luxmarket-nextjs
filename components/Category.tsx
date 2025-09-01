'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Grid3X3, List, Loader2, Search } from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';
import { productsService, Product } from '@/lib/products-api';

type Props = {
  categoryId: string;
  title?: string;
  subtitle?: string;
  defaultView?: 'grid' | 'list';
  perPage?: number;  
};

const sortOptions = [
  { value: 'date', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title', label: 'Alphabetical' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-50k', label: 'Under $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-500k', label: '$100,000 - $500,000' },
  { value: '500k-1m', label: '$500,000 - $1M' },
  { value: '1m+', label: 'Over $1M' },
];

export default function Category({
  categoryId,
  title = 'Explore Collection',
  subtitle,
  defaultView = 'grid',
  perPage = 12,
}: Props) {
  // UI
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsService.getProducts({
        page: 1,
        per_page: perPage,
        search: searchQuery.trim() || undefined,
        orderby: 'date',
        order: 'desc',
        category: categoryId, // single-category fetch
      });

      setAllProducts(response.products);
      setTotalCount(response.totalCount);
      setHasLoadedAll(response.products.length >= response.totalCount);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (hasLoadedAll || loadingMore) return;
    try {
      setLoadingMore(true);
      const currentPage = Math.floor(allProducts.length / 20) + 1;

      const response = await productsService.getProducts({
        page: currentPage + 1,
        per_page: 20,
        search: searchQuery.trim() || undefined,
        orderby: 'date',
        order: 'desc',
        category: categoryId,
      });

      setAllProducts(prev => [...prev, ...response.products]);
      setHasLoadedAll(prev => {
        const total = prev ? allProducts.length + response.products.length : allProducts.length + response.products.length;
        return total >= response.totalCount;
      });
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      );
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseInt(product.price.replace(/[$,]/g, ''), 10);
        switch (priceRange) {
          case '0-50k': return price < 50000;
          case '50k-100k': return price >= 50000 && price <= 100000;
          case '100k-500k': return price >= 100000 && price <= 500000;
          case '500k-1m': return price >= 500000 && price <= 1000000;
          case '1m+': return price > 1000000;
          default: return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[$,]/g, ''), 10) - parseInt(b.price.replace(/[$,]/g, ''), 10);
        case 'price-desc':
          return parseInt(b.price.replace(/[$,]/g, ''), 10) - parseInt(a.price.replace(/[$,]/g, ''), 10);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [allProducts, searchQuery, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSortBy('date');
    setPriceRange('all');
    setSearchQuery('');
  };

  // load initial + on search change
  useEffect(() => {
    loadAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {subtitle && <p className="text-lg text-gray-300 mb-8">{subtitle}</p>}

            {/* Search */}
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
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="hidden md:flex hover:scale-105 transition-transform duration-200"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <p className="text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredAndSortedProducts.length}</span>{' '}
              {filteredAndSortedProducts.length === 1 ? 'result' : 'results'}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      {showFilters && (
        <section className="bg-gray-100 border-b py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              >
                <option value="" disabled>Sort By</option>
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              >
                {priceRanges.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading && allProducts.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading products...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <Button onClick={loadAllProducts}>Try Again</Button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No items found</div>
              <p className="text-gray-400 mb-4">
                {searchQuery ? `No results found for "${searchQuery}"` : 'No items found in this category'}
              </p>
              <Button variant="outline" onClick={handleClearFilters}>Clear Search & Filters</Button>
            </div>
          )}

          {/* Grid/List */}
          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
            }`}>
              {filteredAndSortedProducts.map((product) => (
                <ProductItem key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && !error && filteredAndSortedProducts.length > 0 && !hasLoadedAll && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMoreProducts}
                disabled={loadingMore}
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Items'
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
