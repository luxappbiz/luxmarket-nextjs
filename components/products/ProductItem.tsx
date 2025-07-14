import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, MapPin } from 'lucide-react';

interface ProductItemProps {
  product: {
    id: number;
    featured?: boolean;
    status?: string;
    image: string;
    title: string;
    category: string;
    price: string;
    originalPrice?: string;
    location: string;
    date: string;
    seller: {
      name: string;
      verified?: boolean;
    };
  };
  viewMode: 'grid' | 'list';
  getCategoryIcon: (category: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  viewMode,
  getCategoryIcon,
  getStatusColor,
}) => {
  return (
    <Card
      key={product.id}
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative">
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-black text-white z-10">
            Featured
          </Badge>
        )}
        {product.status && (
          <Badge
            className={`absolute top-2 right-2 text-white z-10 ${getStatusColor(product.status)}`}
          >
            {product.status === 'pending' ? 'Pending' : product.status === 'sold' ? 'Sold' : 'Available'}
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className={`${viewMode === 'grid' ? 'aspect-[4/3]' : 'aspect-[3/2]'} relative overflow-hidden`}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getCategoryIcon(product.category)}
              <span className="text-xs text-gray-500 capitalize">{product.category.replace('-', ' ')}</span>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{product.date}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full" />
            <div>
              <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
              {product.seller.verified && (
                <p className="text-xs text-green-600">✓ Verified</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductItem;