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
