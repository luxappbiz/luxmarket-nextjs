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

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lux_user') {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

const login = (token: string, userData: User, rememberMe = false, appPassword?: string) => {
  const userWithAuth = { ...userData, token, application_password: appPassword };
  setUser(userWithAuth);
  
  localStorage.setItem("user", JSON.stringify(userWithAuth));
  localStorage.setItem("lux_token", token);
  if (appPassword) {
    localStorage.setItem("lux_app_password", appPassword);
  }

  // Also set cookie for middleware
  const days = rememberMe ? 30 : 1;
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `lux_auth_token=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

  window.dispatchEvent(new Event('authStateChanged'));
};

const logout = () => {
  setUser(null);
  
  localStorage.removeItem("user");
  localStorage.removeItem("lux_user");
  localStorage.removeItem("lux_token");
  localStorage.removeItem("lux_app_password");
  
  // Clear cookies
  document.cookie = 'user_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'lux_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.dispatchEvent(new Event('authStateChanged'));
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