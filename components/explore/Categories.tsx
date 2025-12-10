'use client';

import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, List, LucideIcon } from 'lucide-react';

interface Category {
    id: string;
    label: string;
    icon: LucideIcon;
    count: number;
}

interface ExploreCategoriesProps {
    categories: Category[];
    selectedCategory: string;
    handleCategoryChange: (categoryId: string) => void;
    loading: boolean;
    loadingMore: boolean;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
}

export default function ExploreCategories({
    categories,
    selectedCategory,
    handleCategoryChange,
    loading,
    loadingMore,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
}: ExploreCategoriesProps) {
    return (
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
    );
}
