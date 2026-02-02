"use client";

import { useContext } from 'react';
import { FavoriteContext } from '@/contexts/FavoriteContext';

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}