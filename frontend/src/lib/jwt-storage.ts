/**
 * JWT Storage utilities for managing authentication tokens
 */

const TOKEN_KEY = 'auth_token';

/**
 * Save JWT token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
}

/**
 * Clear all tokens from localStorage (alias for removeToken for consistency)
 */
export function clearTokens(): void {
  removeToken();
}

/**
 * Check if user has a valid token (basic check, doesn't validate JWT)
 */
export function hasToken(): boolean {
  return !!getToken();
}
