// lib/account-api.ts
import axios from 'axios';
import { getLuxUserAuth } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

const accountApi = axios.create({
  baseURL: `${BASE_URL}/wp-json/lux/v1`,
  auth: {
    username: CONSUMER_KEY!,
    password: CONSUMER_SECRET!,
  },
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
      // Try server-side auth first
      let userAuth = await getLuxUserAuth();
      // If server-side auth fails, try client-side fallback
      if (!userAuth && typeof window !== 'undefined') {
        const user = localStorage.getItem('lux_user');
        const appPassword = localStorage.getItem('lux_app_password');
        const token = localStorage.getItem('lux_token');
        if (user && (appPassword || token)) {
          try {
            const userData = JSON.parse(user);
            const userLogin = userData.user_login || userData.user_email;
            const password = appPassword || token;
            if (userLogin && password) {
              userAuth = {
                userLogin,
                appPassword: password
              };
            }
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
          }
        }
      }
      if (!userAuth) {
        return {
          success: false,
          message: 'User not authenticated. Please login again.'
        };
      }
      const formData = new FormData();
      // Add product data
      Object.entries(productData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      // Add thumbnail
      formData.append('thumbnail', thumbnail);
      // Add gallery images
      galleryImages.forEach((image, index) => {
        formData.append(`gallery_images[${index}]`, image);
      });
      // Use user authentication for product creation
      const response = await axios.post(
        `${BASE_URL}/wp-json/lux/v1/create-product/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Basic ${btoa(userAuth.userLogin + ":" + userAuth.appPassword)}`,
          }
        }
      );
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
      const userAuth = await getLuxUserAuth();
      if (!userAuth) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }
      const response = await accountApi.post('/update-profile/', profileData, {
        headers: {
          'Authorization': `Basic ${btoa(userAuth.userLogin + ":" + userAuth.appPassword)}`
        }
      });
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
      const userAuth = await getLuxUserAuth();
      if (!userAuth) {
        return {
          success: false,
          message: 'User not authenticated',
          orders: []
        };
      }
      const response = await accountApi.get('/user-orders/', {
        params: {
          page,
          per_page: perPage
        },
        headers: {
          'Authorization': `Basic ${btoa(userAuth.userLogin + ":" + userAuth.appPassword)}`
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
      const userAuth = await getLuxUserAuth();
      if (!userAuth) {
        return {
          success: false,
          message: 'User not authenticated',
          products: []
        };
      }

      const response = await accountApi.get('/user-products/', {
        params: {
          page,
          per_page: perPage
        },
        headers: {
          'Authorization': `Basic ${btoa(userAuth.userLogin + ":" + userAuth.appPassword)}`
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