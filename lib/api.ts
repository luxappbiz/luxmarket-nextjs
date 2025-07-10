
import axios from 'axios';

const API_BASE_URL = 'https://luxapp.biz/wp-json/lux/v1';

export const luxApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
luxApi.interceptors.response.use(
  (response:any) => response,
  (error:any) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);


export const authApi = {
  register: async (email: string, password: string) => {
    const response = await luxApi.post('/register', {
      email,
      password,
    });
    return response.data;
  },

  login: async (login: string, password: string) => {
    const response = await luxApi.post('/login', {
      login,
      password,
    });
    return response.data;
  },

  // You'll need to implement this endpoint in WordPress
  resetPassword: async (email: string) => {
    const response = await luxApi.post('/reset-password', {
      email,
    });
    return response.data;
  },
};

// Storage helpers
export const tokenStorage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lux_token', token);
    }
  },
  
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lux_token');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lux_token');
    }
  },
  
  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lux_user', JSON.stringify(user));
    }
  },
  
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('lux_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};