/**
 * Admin Dashboard Layout
 * 
 * Purpose: Wrapper layout for all admin pages
 * Features:
 * - Role verification (admin only)
 * - Redirect if unauthorized
 * - Persistent sidebar navigation
 * - Top navigation bar
 * 
 * Routes under this layout:
 * - /admin (dashboard home)
 * - /admin/equipment (equipment management)
 * - /admin/teams (team management)
 * - /admin/users (user management)
 * - /admin/requests (maintenance requests)
 * - /admin/calendar (maintenance calendar)
 * - /admin/reports (system reports)
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticatedWithRole } from '@/lib/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    // If not, redirect to appropriate dashboard
    if (!isAuthenticatedWithRole('admin')) {
      router.replace('/login')
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        {/* Admin-specific content wrapper */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
