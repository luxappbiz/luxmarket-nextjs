'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import ProductItem from '@/components/products/ProductItem';
import { Product } from '@/lib/products-api';
import { productsService } from '@/lib/products-api';

export default function WishlistPage() {
  const { favorites, loadingFavorite, onFavoriteRefresh } = useFavorites();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, userLoading, router]);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (!isAuthenticated || loadingFavorite) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const favoriteProducts: Product[] = [];
        
        if (typeof favorites === 'object' && !Array.isArray(favorites)) {
          const favoriteIds = Object.values(favorites).map((fav: any) => fav.id);
          
          for (const id of favoriteIds) {
            try {
              const product = await productsService.getProduct(String(id));
              favoriteProducts.push(product);
            } catch (err) {
              console.error(`Error loading product ${id}:`, err);
            }
          }
        }
        
        setProducts(favoriteProducts);
      } catch (err: any) {
        console.error('Error loading favorite products:', err);
        setError(err.message || 'Failed to load favorite products');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadFavoriteProducts();
    }
  }, [favorites, isAuthenticated, loadingFavorite]);

  if (userLoading || loadingFavorite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-12 md:py-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/white-cars-garage.jpg)' }}
      >
        <div className="absolute bg-black/50 inset-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">My Wishlist</h1>
            <p className="text-base sm:text-lg text-gray-300 mb-6 md:mb-8 px-2">
              {products.length > 0 
                ? `You have ${products.length} saved item${products.length !== 1 ? 's' : ''} in your collection`
                : 'Your saved favorite items will appear here'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {loading && (
          <div className="flex flex-col sm:flex-row justify-center items-center py-12 px-4">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-sm sm:text-base text-gray-500 mt-2 sm:mt-0">Loading your favorites...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12 px-4">
            <div className="text-red-500 text-base sm:text-lg mb-4">{error}</div>
            <Button onClick={onFavoriteRefresh} className="w-full sm:w-auto">Try Again</Button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto px-4">
              <div className="relative inline-block mb-4 sm:mb-6">
                <Heart className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-gray-200 mx-auto" />
                <div className="absolute inset-0 bg-gray-100 rounded-full blur-2xl opacity-50"></div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 font-serif">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg px-2">
                Start building your collection by adding items you love
              </p>
              <Button 
                size="lg" 
                onClick={() => router.push('/explore')}
                className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                Explore Products
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-between px-2 sm:px-0">
              <div className="text-xs sm:text-sm text-gray-500">
                Showing {products.length} {products.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  viewMode="grid"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}