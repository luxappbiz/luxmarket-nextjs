// components/products/ProductItem.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Product } from '@/lib/products-api';

interface ProductItemProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductItem({ product, viewMode = 'grid' }: ProductItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sold': return 'bg-red-600 hover:bg-red-700';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700';
      default: return 'bg-green-600 hover:bg-green-700';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sold': return 'SOLD';
      case 'pending': return 'PENDING';
      default: return 'AVAILABLE';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClasses = "h-3 w-3";
    switch (category) {
      case 'vehicles':
        return <div className={`${iconClasses} bg-blue-500 rounded-full`} />;
      case 'real-estate':
        return <div className={`${iconClasses} bg-green-500 rounded-full`} />;
      case 'watches':
        return <div className={`${iconClasses} bg-purple-500 rounded-full`} />;
      default:
        return <div className={`${iconClasses} bg-gray-500 rounded-full`} />;
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden py-0 gap-3">
        <div className="md:flex">
          <div className="relative md:w-64 h-48 md:h-auto">
            {product.status === 'sold' && (
              <Badge className={`absolute top-2 left-2 z-10 ${getStatusColor(product.status)} text-white`}>
                {getStatusText(product.status)}
              </Badge>
            )}
            {product.featured && (
              <Badge className="absolute top-2 right-2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white">
                FEATURED
              </Badge>
            )}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
          <CardContent className="flex-1 py-3">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(product.category)}
                  <span className="text-sm text-gray-600 capitalize">
                    {product.category.replace('-', ' ')}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {product.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {product.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{product.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{product.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">by</span>
                  <span className="font-medium text-gray-900">{product.seller.name}</span>
                  {product.seller.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Badge
                className={`${getStatusColor(product.status)} text-white text-xs`}
              >
                {getStatusText(product.status)}
              </Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden py-0 gap-0">
      <div className="relative">
        {product.status === 'sold' && (
          <Badge className={`absolute top-2 left-2 z-10 ${getStatusColor(product.status)} text-white text-xs`}>
            {getStatusText(product.status)}
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-2 right-2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
            FEATURED
          </Badge>
        )}
        <div className="absolute top-2 right-2 z-10">
          <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {getCategoryIcon(product.category)}
          <span className="text-xs text-gray-600 capitalize">
            {product.category.replace('-', ' ')}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-gray-700 transition-colors line-clamp-2">
          {product.title}
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {product.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{product.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{product.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">{product.seller.name}</span>
            {product.seller.verified && (
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
          <Badge
            className={`${getStatusColor(product.status)} text-white text-xs px-2 py-1`}
          >
            {getStatusText(product.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}