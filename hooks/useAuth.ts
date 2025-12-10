'use client';

import { useState, useEffect } from 'react';
import { parseUserFromCookie, isAuthenticated } from '@/lib/auth-utils';

/**
 * Custom hook to check authentication status from cookies
 * Automatically updates when auth state changes
 * 
 * @returns {Object} { isLoggedIn: boolean, user: any | null }
 */
export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuthStatus = () => {
            const userData = parseUserFromCookie();
            if (userData) {
                setIsLoggedIn(true);
                setUser(userData);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        // Initial check
        checkAuthStatus();
        // Listen for auth state changes
        const handleAuthChange = () => checkAuthStatus();
        window.addEventListener('authStateChanged', handleAuthChange);
        // Poll for cookie changes (since cookies don't trigger storage events)
        // Polling interval can be adjusted based on needs
        const interval = setInterval(checkAuthStatus, 1000);
        return () => {
            window.removeEventListener('authStateChanged', handleAuthChange);
            clearInterval(interval);
        };
    }, []);

    return { isLoggedIn, user };
}
