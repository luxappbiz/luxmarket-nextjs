"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from 'next/navigation';

interface User {
  ID: string;
  display_name: string;
  user_login: string;
  user_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  image: string;
  website: string;
  token: string;
  user_nicename: string;
  affiliate_id: number;
  user_registered: string;
  is_event_host: boolean;
  application_password?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User, rememberMe?: boolean, appPassword?: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Higher-order component for protecting routes (copied from AuthContext)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user from both cookies and localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        // First try cookies
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_info='))
          ?.split('=')[1];
        
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          setUser(userData);
          setIsLoading(false);
          return;
        }
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem("lux_user") || localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lux_user' || e.key === 'user') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update localStorage when user changes (for backward compatibility)
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("lux_user");
    }
  }, [user]);

  const login = (token: string, userData: User, rememberMe = false, appPassword?: string) => {
    // Store user data
    const userWithAuth = { ...userData, token, application_password: appPassword };
    setUser(userWithAuth);
    
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userWithAuth));
    localStorage.setItem("lux_token", token);
    if (appPassword) {
      localStorage.setItem("lux_app_password", appPassword);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear both localStorage and cookies
    localStorage.removeItem("user");
    localStorage.removeItem("lux_user");
    localStorage.removeItem("lux_token");
    localStorage.removeItem("lux_app_password");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = { 
    user, 
    setUser, 
    logout, 
    isLoading, 
    isAuthenticated,
    login,
    updateUser
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};