import axios from 'axios';

// Create axios instance with basic auth
const productsApi = axios.create({
  baseURL: `/api/commerce/wc/v3`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on your API response
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: string[];
  author: {
    id: string;
    name: string;
    image_url: string | false;
  };
  short_description: string;
  description: string;
  product: {
    price: string;
    regular_price: string;
    sale_price: string;
    mileage: string;
    horsepower: string;
    interiorColor: string;
    exteriorColor: string;
    year: string;
    make: string;
    model: string;
    transmissionType: string;
  };
}

// Your existing Product interface
export interface Product {
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
  createdAt?: string;
  
}

// Mapping function to convert WooCommerce product to your Product interface
export const mapWooCommerceProduct = (wcProduct: WooCommerceProduct): Product => {
  // Determine category based on WooCommerce categories
  const getCategoryFromWC = (categories: WooCommerceProduct['categories']): Product['category'] => {
    const categoryName = categories[0]?.name?.toLowerCase() || '';
    if (categoryName.includes('vehicle')) return 'vehicles';
    if (categoryName.includes('real estate') || categoryName.includes('property')) return 'real-estate';
    if (categoryName.includes('watch') || categoryName.includes('timepiece')) return 'watches';
    return 'other';
  };

  // Determine status
  const getStatus = (stockStatus: string, onSale: boolean): Product['status'] => {
    if (stockStatus === 'outofstock') return 'sold';
    if (onSale) return 'pending';
    return 'available';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  // Format price
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return {
    id: wcProduct.id.toString(),
    title: wcProduct.name,
    price: formatPrice(wcProduct.price),
    originalPrice: wcProduct.sale_price && wcProduct.regular_price !== wcProduct.price 
      ? formatPrice(wcProduct.regular_price) 
      : undefined,
    image: wcProduct.images[0] || '/images/placeholder.jpg',
    category: getCategoryFromWC(wcProduct.categories),
    location: 'Luxury Location', // You might want to add location to your WC product data
    date: formatDate(wcProduct.date_created),
    featured: wcProduct.featured,
    status: getStatus(wcProduct.stock_status, wcProduct.on_sale),
    seller: {
      name: wcProduct.author.name || 'LUX Seller',
      verified: true, // You might want to add verification status to your WC product data
    },
  };
};

export interface ProductsApiResponse {
  products: Product[];
  totalCount: number;
  totalPages: number;
}

export interface GetProductsParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: 'date' | 'price' | 'title';
  order?: 'asc' | 'desc';
  status?: string;
}

// API functions
export const productsService = {
  // Get all products
  getProducts: async (params: GetProductsParams = {}): Promise<ProductsApiResponse> => {
    try {
      const {
        page = 1,
        per_page = 20,
        category,
        search,
        orderby = 'date',
        order = 'desc',
        status = 'publish'
      } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        orderby,
        order,
        status,
      });
      if (category && category !== 'all') {
        queryParams.append('category', category);
      }
      if (search) {
        queryParams.append('search', search);
      }
      const response = await productsApi.get(`/products?${queryParams.toString()}`);
      const products: Product[] = response.data.map(mapWooCommerceProduct);
      // Get total count from headers
      const totalCount = parseInt(response.headers['x-wp-total'] || '0');
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      return {
        products,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },
  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await productsApi.get(`/products/${id}`);
      return mapWooCommerceProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },
  // Get categories
  getCategories: async () => {
    try {
      const response = await productsApi.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },
};

export default productsService;
