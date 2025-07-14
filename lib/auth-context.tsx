'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/api';

interface User {
    id: string;
    email: string;
    username?: string;
    display_name?: string;
    has_active_membership?: boolean;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, userData: User, rememberMe?: boolean, appPassword?: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                if (authUtils.isAuthenticated()) {
                    const userData = authUtils.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid auth data
                authUtils.logout();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const handleAuthStateChange = () => {
            if (authUtils.isAuthenticated()) {
                const userData = authUtils.getCurrentUser();
                setUser(userData);
            } else {
                setUser(null);
            }
        };

        // Listen for storage changes (cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'lux_token' || e.key === 'lux_user') {
                handleAuthStateChange();
            }
        };

        window.addEventListener('authStateChanged', handleAuthStateChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('authStateChanged', handleAuthStateChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token: string, userData: User, rememberMe = false, appPassword?: string) => {
        authUtils.setAuthData(token, userData, rememberMe, appPassword);
        setUser(userData);
    };

    const logout = () => {
        authUtils.logout();
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            // Just update the user data in storage, keep the existing token
            authUtils.setUser(updatedUser);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo: string = '/login'
) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuth();
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