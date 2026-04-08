// lib/account-api.ts
import axios from 'axios';

const accountApi = axios.create({
  baseURL: `/api/account`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for create product
export interface CreateProductData {
  title: string;
  regular_price: string;
  category_id: string;
  mileage?: string;
  horsepower?: string;
  interiorColor?: string;
  exteriorColor?: string;
  year?: string;
  make?: string;
  model?: string;
  transmissionType?: string;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product_id?: number;
}

// Account API service
export const accountService = {
  // Create product (uses server-side auth with localStorage fallback)
  createProduct: async (
    productData: CreateProductData,
    thumbnail: File,
    galleryImages: File[]
  ): Promise<CreateProductResponse> => {
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      formData.append('thumbnail', thumbnail);
      galleryImages.forEach((image, index) => {
        formData.append(`gallery_images[${index}]`, image);
      });
      const response = await accountApi.post('/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return {
        success: true,
        message: 'Product submitted for review successfully!',
        product_id: response.data.id
      };
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.statusText || 
                          'Failed to create product. Please try again.';
      return {
        success: false,
        message: errorMessage
      };
    }
  },
  // Update user profile
  updateProfile: async (profileData: {
    display_name?: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const response = await accountApi.post('/update-profile', profileData);
      return {
        success: true,
        message: 'Profile updated successfully!',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Get user orders
  getUserOrders: async (page: number = 1, perPage: number = 10) => {
    try {
      const response = await accountApi.get('/user-orders', {
        params: {
          page,
          per_page: perPage
        }
      });

      return {
        success: true,
        orders: response.data.orders || [],
        totalCount: response.data.total || 0
      };
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders',
        orders: []
      };
    }
  },

  // Get user products
  getUserProducts: async (page: number = 1, perPage: number = 10) => {
    try {
      const response = await accountApi.get('/user-products', {
        params: {
          page,
          per_page: perPage
        }
      });

      return {
        success: true,
        products: response.data.products || [],
        totalCount: response.data.total || 0
      };
    } catch (error: any) {
      console.error('Error fetching user products:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
        products: []
      };
    }
  }
};

export default accountService;
