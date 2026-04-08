'use client';

import { useUser } from '@/contexts/UserContext';

/**
 * Backward-compatible auth hook layered on top of UserContext.
 */
export function useAuth() {
    const { user, isAuthenticated, isLoading, login, logout, updateUser } = useUser();

    return {
        user,
        isLoggedIn: isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
    };
}
