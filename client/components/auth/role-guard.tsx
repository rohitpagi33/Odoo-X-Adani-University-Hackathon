/**
 * RoleGuard Component
 * 
 * Purpose: Protect pages/components based on user role
 * Usage: Wrap pages that require specific role(s)
 * 
 * Example:
 * <RoleGuard allowedRoles={["admin", "manager"]}>
 *   <EquipmentPage />
 * </RoleGuard>
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRole, isAuthenticated } from '@/lib/auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'manager' | 'technician')[]
  fallbackComponent?: React.ReactNode
}

/**
 * RoleGuard Component
 * 
 * @param children - Component to render if authorized
 * @param allowedRoles - Array of allowed roles
 * @param fallbackComponent - Optional component to show if unauthorized
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackComponent
}: RoleGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and has required role
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      router.replace('/login')
      return
    }

    const userRole = getRole()
    
    if (userRole && allowedRoles.includes(userRole)) {
      // User is authorized
      setIsAuthorized(true)
    } else {
      // User is authenticated but doesn't have required role
      // Redirect to their own dashboard
      const role = userRole as 'admin' | 'manager' | 'technician'
      const dashboardMap = {
        admin: '/admin',
        manager: '/manager',
        technician: '/technician'
      }
      router.replace(dashboardMap[role] || '/login')
    }

    setIsLoading(false)
  }, [allowedRoles, router])

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    )
  }

  // Show fallback component if not authorized and fallback is provided
  if (!isAuthorized && fallbackComponent) {
    return <>{fallbackComponent}</>
  }

  // Show children if authorized
  return isAuthorized ? <>{children}</> : null
}
