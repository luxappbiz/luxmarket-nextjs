"use client";

import { createContext } from 'react';

export interface FavoriteProduct {
  id: string;
  [key: string]: any;
}

interface FavoriteContextType {
  loadingFavorite: boolean;
  favorites: Record<string, FavoriteProduct> | FavoriteProduct[];
  refreshingFavorite: boolean;
  error: any;
  addFavorite: (product_id: string | number) => Promise<void>;
  getFavorites: () => Promise<void>;
  removeFavorite: (product_id: string | number) => Promise<void>;
  onFavoriteRefresh: () => void;
  isFavorite: (product_id: string | number) => boolean;
}

export const FavoriteContext = createContext<FavoriteContextType>({
  loadingFavorite: true,
  favorites: {},
  refreshingFavorite: false,
  error: null,
  addFavorite: async () => {},
  getFavorites: async () => {},
  removeFavorite: async () => {},
  onFavoriteRefresh: () => {},
  isFavorite: () => false,
});