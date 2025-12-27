/**
 * Authentication Utility Functions
 * Single source of truth for authentication state management
 * Handles token, user data, and role-based access
 */

export const TOKEN_KEY = 'GG_TOKEN'
export const USER_KEY = 'GG_USER'

// ============================================
// TOKEN MANAGEMENT
// ============================================

/**
 * Get JWT token from localStorage
 * @returns Token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Store JWT token in localStorage
 * @param token - JWT token from server
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Remove JWT token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// ============================================
// USER DATA MANAGEMENT
// ============================================

/**
 * User type definition
 */
export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'technician'
  token: string
}

/**
 * Get complete user object from localStorage
 * @returns User object or null if not found
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const userJSON = localStorage.getItem(USER_KEY)
  if (!userJSON) return null
  try {
    return JSON.parse(userJSON) as User
  } catch {
    return null
  }
}

/**
 * Store user data in localStorage
 * @param user - User object from server response
 */
export function setUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Remove user data from localStorage
 */
export function clearUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

// ============================================
// ROLE-BASED ACCESS CHECKS
// ============================================

/**
 * Get user's role
 * @returns 'admin' | 'manager' | 'technician' or null
 */
export function getRole(): 'admin' | 'manager' | 'technician' | null {
  const user = getUser()
  return user?.role ?? null
}

/**
 * Check if user has specific role
 * @param requiredRole - Role to check against
 * @returns true if user has the role
 */
export function hasRole(requiredRole: 'admin' | 'manager' | 'technician'): boolean {
  const userRole = getRole()
  return userRole === requiredRole
}

/**
 * Check if user has any of the required roles
 * @param requiredRoles - Array of roles to check
 * @returns true if user has any of the roles
 */
export function hasAnyRole(requiredRoles: ('admin' | 'manager' | 'technician')[]): boolean {
  const userRole = getRole()
  return userRole ? requiredRoles.includes(userRole) : false
}

// ============================================
// AUTHENTICATION STATE
// ============================================

/**
 * Check if user is authenticated
 * @returns true if token and user exist
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken() && getUser())
}

/**
 * Check if user is authenticated AND has required role
 * @param requiredRole - Role to check
 * @returns true if authenticated and has role
 */
export function isAuthenticatedWithRole(requiredRole: 'admin' | 'manager' | 'technician'): boolean {
  return isAuthenticated() && hasRole(requiredRole)
}

// ============================================
// LOGOUT
// ============================================

/**
 * Clear all authentication data
 * Used during logout
 */
export function logout(): void {
  clearToken()
  clearUser()
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get dashboard route based on user role
 * @returns '/admin', '/manager', '/technician' or '/login'
 */
export function getDashboardRoute(): string {
  const role = getRole()
  switch (role) {
    case 'admin':
      return '/admin'
    case 'manager':
      return '/manager'
    case 'technician':
      return '/technician'
    default:
      return '/login'
  }
}

/**
 * Validate user session
 * @returns true if user is properly authenticated with valid token
 */
export function validateSession(): boolean {
  const token = getToken()
  const user = getUser()

  if (!token || !user) {
    logout()
    return false
  }

  // Can add JWT expiration check here if needed
  return true
}
