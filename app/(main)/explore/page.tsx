'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    Car,
    Home,
    Watch,
    Sparkles,
    Grid3X3,
    List,
    Loader2
} from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';
import { productsService, Product } from '@/lib/products-api';

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

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [priceRange, setPriceRange] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // API state - Store ALL products and filter client-side
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasLoadedAll, setHasLoadedAll] = useState(false);

    // Load all products initially (without category filter)
    const loadAllProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load all products without category filter
            const response = await productsService.getProducts({
                page: 1,
                per_page: 100, // Load more products initially
                search: searchQuery.trim() || undefined,
                orderby: 'date',
                order: 'desc',
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

    // Load more products
    const loadMoreProducts = async () => {
        if (hasLoadedAll || loadingMore) return;

        try {
            setLoadingMore(true);
            const currentPage = Math.ceil(allProducts.length / 20) + 1;

            const response = await productsService.getProducts({
                page: currentPage,
                per_page: 20,
                search: searchQuery.trim() || undefined,
                orderby: 'date',
                order: 'desc',
            });

            setAllProducts(prev => [...prev, ...response.products]);
            //@ts-ignore
            setHasLoadedAll(prev => prev.concat(response.products).length >= response.totalCount);
        } catch (err) {
            console.error('Error loading more products:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    // Filter and sort products client-side
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }

        // Filter by price range
        if (priceRange !== 'all') {
            filtered = filtered.filter(product => {
                const price = parseInt(product.price.replace(/[$,]/g, ''));

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

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return parseInt(a.price.replace(/[$,]/g, '')) - parseInt(b.price.replace(/[$,]/g, ''));
                case 'price-desc':
                    return parseInt(b.price.replace(/[$,]/g, '')) - parseInt(a.price.replace(/[$,]/g, ''));
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'date':
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });

        return filtered;
    }, [allProducts, selectedCategory, searchQuery, priceRange, sortBy]);

    // Calculate category counts from all products
    const categories = useMemo(() => {
        const vehicleCount = allProducts.filter(p => p.category === 'vehicles').length;
        const realEstateCount = allProducts.filter(p => p.category === 'real-estate').length;
        const watchCount = allProducts.filter(p => p.category === 'watches').length;
        const otherCount = allProducts.filter(p => p.category === 'other').length;

        return [
            { id: 'all', label: 'All Items', icon: Sparkles, count: filteredAndSortedProducts.length },
            { id: 'vehicles', label: 'Vehicles', icon: Car, count: vehicleCount },
            { id: 'real-estate', label: 'Real Estate', icon: Home, count: realEstateCount },
            { id: 'watches', label: 'Watches', icon: Watch, count: watchCount },
        ];
    }, [allProducts, filteredAndSortedProducts.length]);

    // Load products on component mount and when search changes
    useEffect(() => {
        loadAllProducts();
    }, [searchQuery]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        // No need to reload - filtering happens client-side
    };

    const handleSearch = () => {
        // Search will trigger useEffect to reload products
        loadAllProducts();
    };

    const handleClearFilters = () => {
        setSortBy('date');
        setPriceRange('all');
        setSearchQuery('');
        setSelectedCategory('all');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Explore Luxury Collection
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            Discover over {totalCount.toLocaleString()} verified luxury items from trusted sellers worldwide
                        </p>

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

            {/* Categories Bar - Enhanced Hover Effects */}
            <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-1 overflow-x-auto">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const isActive = selectedCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        disabled={loading && !loadingMore}
                                        className={`group flex items-center space-x-2 pb-2 border-b-2 transition-colors duration-200 whitespace-nowrap cursor-pointer ${isActive
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                                            } ${loading && !loadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'
                                            }`} />
                                        <span className={`font-medium ${isActive ? 'text-black' : 'group-hover:font-semibold'
                                            }`}>
                                            {category.label}
                                        </span>
                                        <span className={`text-sm ${isActive ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-700'
                                            }`}>
                                            ({category.count})
                                        </span>

                                        {/* Simple loading indicator for active category */}
                                        {isActive && loading && !loadingMore && (
                                            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-black/20">
                                                <div className="h-full bg-black animate-pulse" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center space-x-3">
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
                    </div>
                </div>
            </section>

            {/* Filters Bar */}
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
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                            >
                                {priceRanges.map(range => (
                                    <option key={range.value} value={range.value}>
                                        {range.label}
                                    </option>
                                ))}
                            </select>

                            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-medium text-gray-900">{filteredAndSortedProducts.length}</span>
                            {selectedCategory !== 'all' && (
                                <span> {selectedCategory.replace('-', ' ')} </span>
                            )}
                            {filteredAndSortedProducts.length === 1 ? 'result' : 'results'}
                            {searchQuery && (
                                <span> for "{searchQuery}"</span>
                            )}
                        </p>

                        {selectedCategory !== 'all' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCategoryChange('all')}
                            >
                                View All Items
                            </Button>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && allProducts.length === 0 && (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            <span className="ml-2 text-gray-500">Loading products...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-500 text-lg mb-4">{error}</div>
                            <Button onClick={() => loadAllProducts()}>
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && !error && filteredAndSortedProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">No items found</div>
                            <p className="text-gray-400 mb-4">
                                {searchQuery
                                    ? `No results found for "${searchQuery}"`
                                    : `No items found in ${selectedCategory.replace('-', ' ')} category`
                                }
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                            >
                                Clear Search & Filters
                            </Button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && filteredAndSortedProducts.length > 0 && (
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                            }`}>
                            {filteredAndSortedProducts.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}

                    {/* Load More */}
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