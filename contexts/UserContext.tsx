"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from 'next/navigation';
import { clearSessionAction } from "@/app/actions/auth";
import {
  AUTH_STATE_CHANGED_EVENT,
  clearStoredSession,
  readStoredUser,
  SessionUser,
  updateStoredUser,
  writeSession,
} from "@/lib/session-client";

interface UserContextType {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: SessionUser, rememberMe?: boolean, appPassword?: string) => void;
  updateUser: (userData: Partial<SessionUser>) => void;
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
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const loadUser = () => {
      try {
        setUserState(readStoredUser());
      } catch (error) {
        console.error('Error loading user:', error);
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const syncUserFromStorage = () => {
      setUserState(readStoredUser());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lux_user" || e.key === null) {
        syncUserFromStorage();
      }
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncUserFromStorage);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncUserFromStorage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setUser = (nextUser: SessionUser | null) => {
    if (nextUser) {
      const token = nextUser.token || "";
      writeSession(token, nextUser, nextUser.application_password);
      setUserState(readStoredUser());
      return;
    }

    clearStoredSession();
    setUserState(null);
  };

  const login = (token: string, userData: SessionUser, rememberMe = false, appPassword?: string) => {
    void rememberMe;
    writeSession(token, userData, appPassword);
    setUserState(readStoredUser());
  };

  const logout = async () => {
    setUserState(null);
    clearStoredSession();
    await clearSessionAction();
  };

  const updateUser = (userData: Partial<SessionUser>) => {
    if (user) {
      const updatedUser = updateStoredUser(userData);
      setUserState(updatedUser);
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
