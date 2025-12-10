'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';
import { Product } from '@/lib/products-api';

interface ExploreGridProps {
    filteredAndSortedProducts: Product[];
    selectedCategory: string;
    searchQuery: string;
    handleCategoryChange: (categoryId: string) => void;
    loading: boolean;
    allProducts: Product[];
    error: string | null;
    loadAllProducts: () => void;
    handleClearFilters: () => void;
    viewMode: 'grid' | 'list';
    loadingMore: boolean;
    hasLoadedAll: boolean;
    loadMoreProducts: () => void;
}

export default function ExploreGrid({
    filteredAndSortedProducts,
    selectedCategory,
    searchQuery,
    handleCategoryChange,
    loading,
    allProducts,
    error,
    loadAllProducts,
    handleClearFilters,
    viewMode,
    loadingMore,
    hasLoadedAll,
    loadMoreProducts,
}: ExploreGridProps) {
    return (
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
                        <Button onClick={() => loadAllProducts()}>Try Again</Button>
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
    );
}