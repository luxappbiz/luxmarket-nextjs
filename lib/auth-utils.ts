/**
 * Client-side authentication utilities
 * These functions work with cookies that are accessible to JavaScript
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

/**
 * Parse user data from the lux_user cookie
 * Returns the parsed user object or null if not found/invalid
 */
export function parseUserFromCookie(): any | null {
    const userData = getCookie('lux_user');
    if (!userData) {
        return null;
    }
    
    try {
        // Decode URL-encoded cookie value before parsing
        const decodedUserData = decodeURIComponent(userData);
        return JSON.parse(decodedUserData);
    } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        return null;
    }
}

/**
 * Check if user is authenticated based on lux_user cookie
 */
export function isAuthenticated(): boolean {
    const user = parseUserFromCookie();
    return user !== null;
}

/**
 * Get current user from cookie
 */
export function getCurrentUserFromCookie(): any | null {
    return parseUserFromCookie();
}

