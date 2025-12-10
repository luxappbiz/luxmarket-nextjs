'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Car, Home, Watch, Sparkles, Grid3X3, List, Loader2 } from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';
import { productsService, Product } from '@/lib/products-api';
import ExploreHero from '@/components/explore/Hero';
import ExploreFilters from '@/components/explore/Filters';
import ExploreCategories from '@/components/explore/Categories';
import ExploreGrid from '@/components/explore/Grid';

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
        // const otherCount = allProducts.filter(p => p.category === 'other').length;
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
            <ExploreHero 
                totalCount={totalCount}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                loading={loading}
            />
            {/* Categories Bar */}
            <ExploreCategories
                categories={categories}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                loading={loading}
                loadingMore={loadingMore}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />
            {/* Filters Bar */}
            {showFilters && (
                <ExploreFilters
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    handleClearFilters={handleClearFilters}
                    sortOptions={sortOptions}
                    priceRanges={priceRanges}
                />
            )}
            {/* Products Grid */}
            <ExploreGrid
                filteredAndSortedProducts={filteredAndSortedProducts}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                handleCategoryChange={handleCategoryChange}
                loading={loading}
                allProducts={allProducts}
                error={error}
                loadAllProducts={loadAllProducts}
                handleClearFilters={handleClearFilters}
                viewMode={viewMode}
                loadingMore={loadingMore}
                hasLoadedAll={hasLoadedAll}
                loadMoreProducts={loadMoreProducts}
            />
        </div>
    );
}