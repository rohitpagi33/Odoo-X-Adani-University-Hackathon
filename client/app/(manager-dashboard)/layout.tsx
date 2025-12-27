/**
 * Manager Dashboard Layout
 * 
 * Purpose: Wrapper layout for all manager pages
 * Features:
 * - Role verification (manager only)
 * - Redirect if unauthorized
 * - Persistent sidebar navigation
 * - Top navigation bar
 * 
 * Routes under this layout:
 * - /manager (dashboard home)
 * - /manager/equipment (equipment management)
 * - /manager/teams (team management)
 * - /manager/requests (maintenance requests)
 * - /manager/calendar (maintenance calendar)
 * - /manager/reports (department reports)
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticatedWithRole } from '@/lib/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

interface ManagerLayoutProps {
  children: React.ReactNode
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is manager
    // If not, redirect to appropriate dashboard
    if (!isAuthenticatedWithRole('manager')) {
      router.replace('/login')
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        {/* Manager-specific content wrapper */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
