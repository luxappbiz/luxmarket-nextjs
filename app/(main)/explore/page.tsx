'use client';

import { useState, useMemo } from 'react';
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
    List
} from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';

interface Product {
    id: string;
    title: string;
    price: string;
    originalPrice?: string;
    image: string;
    category: 'vehicles' | 'real-estate' | 'watches' | 'other';
    location?: string;
    date: string;
    featured?: boolean;
    status?: 'available' | 'sold' | 'pending';
    seller: {
        name: string;
        verified: boolean;
    };
}

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
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
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Sample products data - using local image paths
    const products: Product[] = [
        {
            id: '1',
            title: '2016 Lamborghini Aventador',
            price: '$475,996',
            image: '/images/cars/lamborghini-aventador-2016.jpeg',
            category: 'vehicles',
            location: 'Miami, FL',
            date: '2 days ago',
            featured: true,
            status: 'available',
            seller: { name: 'Luxury Motors', verified: true }
        },
        {
            id: '2',
            title: 'Modern Waterfront Villa',
            price: '$3,750,000',
            image: '/images/real-estate/waterfront-villa.jpeg',
            category: 'real-estate',
            location: 'Malibu, CA',
            date: '5 days ago',
            status: 'available',
            seller: { name: 'Elite Properties', verified: true }
        },
        {
            id: '3',
            title: 'Patek Philippe Nautilus 5711',
            price: '$175,000',
            originalPrice: '$195,000',
            image: '/images/watches/patek-philippe-nautilus.jpeg',
            category: 'watches',
            location: 'New York, NY',
            date: '1 week ago',
            status: 'available',
            seller: { name: 'Timepiece Gallery', verified: true }
        },
        {
            id: '4',
            title: 'Lamborghini Aventador Purple',
            price: '$285,000',
            image: '/images/cars/lamborghini-aventador-purple.jpg',
            category: 'vehicles',
            location: 'Los Angeles, CA',
            date: '3 days ago',
            status: 'pending',
            seller: { name: 'Exotic Cars LA', verified: true }
        },
        {
            id: '5',
            title: 'Rolex Daytona Gold',
            price: '$85,000',
            image: '/images/watches/rolex-daytona-gold.jpg',
            category: 'watches',
            location: 'Chicago, IL',
            date: '4 days ago',
            status: 'available',
            seller: { name: 'Watch Collectors', verified: false }
        },
        {
            id: '6',
            title: 'Penthouse Suite Downtown',
            price: '$2,100,000',
            image: '/images/real-estate/penthouse-suite.jpg',
            category: 'real-estate',
            location: 'Manhattan, NY',
            date: '1 day ago',
            featured: true,
            status: 'available',
            seller: { name: 'Manhattan Realty', verified: true }
        },
        {
            id: '7',
            title: '2022 Pagani Huayra',
            price: '$2,750,000',
            image: '/images/cars/pagani-huayra-2022.webp',
            category: 'vehicles',
            location: 'Dallas, TX',
            date: '6 days ago',
            status: 'available',
            seller: { name: 'Pagani Dallas', verified: true }
        },
        {
            id: '8',
            title: 'Luxury Yacht Marina Berth',
            price: '$1,450,000',
            image: '/images/real-estate/yacht-marina.jpg',
            category: 'real-estate',
            location: 'Newport Beach, CA',
            date: '1 day ago',
            status: 'available',
            seller: { name: 'Marina Properties', verified: true }
        },
        {
            id: '9',
            title: 'Audemars Piguet Royal Oak',
            price: '$95,000',
            image: '/images/watches/audemars-piguet-royal-oak.webp',
            category: 'watches',
            location: 'Las Vegas, NV',
            date: '2 days ago',
            status: 'sold',
            seller: { name: 'Vegas Timepieces', verified: true }
        },
        {
            id: '10',
            title: 'Bugatti Chiron Super Sport',
            price: '$1,096,470',
            image: '/images/cars/bugatti-chiron.jpg',
            category: 'vehicles',
            location: 'Phoenix, AZ',
            date: '4 days ago',
            status: 'available',
            seller: { name: 'Exotic Motors', verified: true }
        },
        {
            id: '11',
            title: '1969 Pontiac GTO Judge',
            price: '$69,000',
            originalPrice: '$77,000',
            image: '/images/cars/pontiac-gto-1969.jpg',
            category: 'vehicles',
            location: 'Detroit, MI',
            date: '1 week ago',
            status: 'sold',
            seller: { name: 'Classic Cars Detroit', verified: true }
        },
        {
            id: '12',
            title: 'Koenigsegg CCGT 2008',
            price: '$3,600,000',
            image: '/images/cars/koenigsegg-ccgt.jpg',
            category: 'vehicles',
            location: 'Beverly Hills, CA',
            date: '3 days ago',
            featured: true,
            status: 'available',
            seller: { name: 'Supercar Gallery', verified: true }
        },
        {
            id: '13',
            title: '2012 Mercedes-Benz G 65 AMG',
            price: '$100,000',
            image: '/images/cars/mercedes-g65-amg.jpg',
            category: 'vehicles',
            location: 'Atlanta, GA',
            date: '5 days ago',
            status: 'available',
            seller: { name: 'AMG Specialist', verified: true }
        },
        {
            id: '14',
            title: 'Pontiac Judge 1969',
            price: '$50,000',
            image: '/images/cars/pontiac-judge-1969.jpg',
            category: 'vehicles',
            location: 'Nashville, TN',
            date: '2 days ago',
            status: 'available',
            seller: { name: 'Muscle Car Classics', verified: true }
        }
    ];

    // Filter products based on selected category and search
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[$,]/g, ''));
                    const priceB = parseInt(b.price.replace(/[$,]/g, ''));
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[$,]/g, ''));
                    const priceB = parseInt(b.price.replace(/[$,]/g, ''));
                    return priceB - priceA;
                });
                break;
            case 'newest':
            default:
                // Keep original order for newest
                break;
        }

        return filtered;
    }, [products, selectedCategory, searchQuery, sortBy]);

    // Calculate dynamic counts for each category
    const categories = useMemo(() => {
        const vehicleCount = products.filter(p => p.category === 'vehicles').length;
        const realEstateCount = products.filter(p => p.category === 'real-estate').length;
        const watchCount = products.filter(p => p.category === 'watches').length;
        const totalCount = products.length;

        return [
            { id: 'all', label: 'All Items', icon: Sparkles, count: totalCount },
            { id: 'vehicles', label: 'Vehicles', icon: Car, count: vehicleCount },
            { id: 'real-estate', label: 'Real Estate', icon: Home, count: realEstateCount },
            { id: 'watches', label: 'Watches', icon: Watch, count: watchCount },
        ];
    }, [products]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'vehicles': return <Car className="h-3 w-3" />;
            case 'real-estate': return <Home className="h-3 w-3" />;
            case 'watches': return <Watch className="h-3 w-3" />;
            default: return <Sparkles className="h-3 w-3" />;
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'sold': return 'bg-red-600';
            case 'pending': return 'bg-yellow-600';
            default: return 'bg-green-600';
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        // Clear search when changing categories for better UX
        setSearchQuery('');
    };

    const handleSearch = () => {
        // Search functionality is handled by the useMemo hook
        // This function can be used for additional search logic if needed
        console.log('Searching for:', searchQuery);
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
                            Discover over {products.length} verified luxury items from trusted sellers worldwide
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
                                className="w-full pl-12 pr-4 py-3 h-14 text-gray-900 bg-white rounded-lg border-0 shadow-lg"
                            />
                            <Button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Bar */}
            <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-6 overflow-x-auto">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`flex items-center space-x-2 pb-2 border-b-2 transition-all whitespace-nowrap ${selectedCategory === category.id
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-600 hover:text-black'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="font-medium">{category.label}</span>
                                        <span className="text-sm text-gray-500">({category.count})</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="hidden md:flex"
                            >
                                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
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

                            <Button variant="ghost" size="sm" onClick={() => {
                                setSortBy('newest');
                                setPriceRange('all');
                                setSearchQuery('');
                            }}>
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
                            Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span>
                            {selectedCategory !== 'all' && (
                                <span> {selectedCategory.replace('-', ' ')} </span>
                            )}
                            {filteredProducts.length === 1 ? 'result' : 'results'}
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

                    {filteredProducts.length === 0 ? (
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
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                            >
                                Clear Search & Filters
                            </Button>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                            }`}>
                            {filteredProducts.map((product) => (
                                <ProductItem product={product}/>
                            ))}
                        </div>
                    )}

                    {/* Load More - Only show if there are results */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-12 text-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                            >
                                Load More Items
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}