import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1`;

export const luxApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
luxApi.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
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

  resetPassword: async (email: string) => {
    const response = await luxApi.post('/reset-password', {
      email,
    });
    return response.data;
  },
};

// Cookie helper functions
export const cookieUtils = {
  setCookie: (name: string, value: string, days: number = 30) => {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  },

  getCookie: (name: string): string | null => {
    if (typeof window !== 'undefined') {
      const nameEQ = name + "=";
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },

  deleteCookie: (name: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
};

// Updated storage helpers
export const tokenStorage = {
  setToken: (token: string, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      // Store in localStorage
      localStorage.setItem('lux_auth_token', token);
      // Store in cookies for middleware
      const days = rememberMe ? 30 : 1; // 30 days if remember me, 1 day otherwise
      cookieUtils.setCookie('lux_auth_token', token, days);
    }
  },
  getToken: () => {
    if (typeof window !== 'undefined') {
      // Try localStorage first, then cookies
      return localStorage.getItem('lux_auth_token') || cookieUtils.getCookie('lux_auth_token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lux_auth_token');
      cookieUtils.deleteCookie('lux_auth_token');
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lux_auth_token', JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('lux_auth_token');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lux_auth_token');
    }
  },

  // Clear all auth data
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lux_auth_token');
      localStorage.removeItem('lux_user');
      localStorage.removeItem('lux_app_password');
      cookieUtils.deleteCookie('lux_auth_token');
    }
  }
};

// Auth state management
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();
    return !!(token && user);
  },
  // Get current user
  getCurrentUser: () => {
    return tokenStorage.getUser();
  },
  // Get current token
  getToken: () => {
    return tokenStorage.getToken();
  },
  // Set user data
  setUser: (user: any) => {
    tokenStorage.setUser(user);
  },
  // Logout user
  logout: () => {
    tokenStorage.clearAll();
    // Dispatch custom event for components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }
  },
};
