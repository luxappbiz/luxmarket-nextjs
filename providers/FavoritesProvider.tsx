"use client";

import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { FavoriteContext, FavoriteProduct } from '@/contexts/FavoriteContext';
import { useUser } from '@/contexts/UserContext';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, FavoriteProduct>>({});
  const [refreshingFavorite, setRefreshingFavorite] = useState(false);
  const [error, setError] = useState<any>(null);
  const { user } = useUser();

  const getAuthHeader = () => {
    if (!user?.user_login) return null;
    
    const appPassword = user.application_password || 
                       (typeof window !== 'undefined' ? localStorage.getItem('lux_app_password') : null) ||
                       user.token;
    
    if (!appPassword) return null;
    
    return 'Basic ' + btoa(`${user.user_login}:${appPassword}`);
  };

  const getFavorites = useCallback(async () => {
    if (!user) {
      setLoadingFavorite(false);
      return;
    }

    setLoadingFavorite(true);
    const timeStamp = new Date().getTime();
    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      setLoadingFavorite(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/favourites?timestamp=${timeStamp}`,
        {
          headers: {
            'Authorization': authHeader
          }
        }
      );
      
      if (res.data.success) {
        const favoritesObj: Record<string, FavoriteProduct> = {};
        if (Array.isArray(res.data.favourite_products)) {
          res.data.favourite_products.forEach((product: FavoriteProduct) => {
            favoritesObj[product.id] = product;
          });
        } else if (res.data.favourite_products && typeof res.data.favourite_products === 'object') {
          Object.assign(favoritesObj, res.data.favourite_products);
        }
        setFavorites(favoritesObj);
      } else {
        console.error(res.data.error);
        setError(res.data.error);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(error);
    } finally {
      setLoadingFavorite(false);
      setRefreshingFavorite(false);
    }
  }, [user]);

  const removeFavorite = async (product_id: string | number) => {
    if (!user) {
      console.warn('Cannot remove favorite: User not logged in');
      return;
    }

    setLoadingFavorite(true);
    setError(null);
    const timeStamp = new Date().getTime();
    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      console.error('Cannot remove favorite: No auth header');
      setLoadingFavorite(false);
      return;
    }

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/favourites?timestamp=${timeStamp}`,
        {
          data: {
            product_id: product_id
          },
          headers: {
            'Authorization': authHeader
          }
        }
      );
      
      if (res.data.success) {
        const favoritesObj: Record<string, FavoriteProduct> = {};
        if (Array.isArray(res.data.favourite_products)) {
          res.data.favourite_products.forEach((product: FavoriteProduct) => {
            favoritesObj[product.id] = product;
          });
        } else if (res.data.favourite_products && typeof res.data.favourite_products === 'object') {
          Object.assign(favoritesObj, res.data.favourite_products);
        }
        setFavorites(favoritesObj);
        console.log('Favorite removed successfully');
      } else {
        console.error('Remove favorite failed:', res.data.error);
        setError(res.data.error);
        throw new Error(res.data.error || 'Failed to remove favorite');
      }
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to remove favorite';
      setError(errorMessage);
      throw error;
    } finally {
      setLoadingFavorite(false);
    }
  };

  const addFavorite = async (product_id: string | number) => {
    if (!user) {
      console.warn('Cannot add favorite: User not logged in');
      return;
    }

    setError(null);
    const timeStamp = new Date().getTime();
    const authHeader = getAuthHeader();
    
    if (!authHeader) {
      console.error('Cannot add favorite: No auth header');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/favourites?timestamp=${timeStamp}`,
        {
          product_id: product_id
        },
        {
          headers: {
            'Authorization': authHeader
          }
        }
      );
      
      if (res.data.success) {
        const favoritesObj: Record<string, FavoriteProduct> = {};
        if (Array.isArray(res.data.favourite_products)) {
          res.data.favourite_products.forEach((product: FavoriteProduct) => {
            favoritesObj[product.id] = product;
          });
        } else if (res.data.favourite_products && typeof res.data.favourite_products === 'object') {
          Object.assign(favoritesObj, res.data.favourite_products);
        }
        setFavorites(favoritesObj);
        console.log('Favorite added successfully');
      } else {
        console.error('Add favorite failed:', res.data.error);
        setError(res.data.error);
        throw new Error(res.data.error || 'Failed to add favorite');
      }
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add favorite';
      setError(errorMessage);
      throw error;
    }
  };

  const onFavoriteRefresh = useCallback(() => {
    setRefreshingFavorite(true);
    getFavorites();
  }, [getFavorites]);

  const isFavorite = useCallback((product_id: string | number): boolean => {
    if (typeof favorites === 'object' && !Array.isArray(favorites)) {
      const idStr = String(product_id);
      return Object.values(favorites).some((product: FavoriteProduct) => {
        const productIdStr = String(product.id);
        return productIdStr === idStr;
      });
    }
    return false;
  }, [favorites]);

  useEffect(() => {
    if (user) {
      getFavorites();
    } else {
      setFavorites({});
      setLoadingFavorite(false);
    }
  }, [user, getFavorites]);

  return (
    <FavoriteContext.Provider
      value={{
        loadingFavorite,
        favorites,
        refreshingFavorite,
        error,
        addFavorite,
        getFavorites,
        removeFavorite,
        onFavoriteRefresh,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoritesProvider;