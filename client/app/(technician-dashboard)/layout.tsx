/**
 * Technician Dashboard Layout
 * 
 * Purpose: Wrapper layout for all technician pages
 * Features:
 * - Role verification (technician only)
 * - Redirect if unauthorized
 * - Persistent sidebar navigation
 * - Top navigation bar
 * 
 * Routes under this layout:
 * - /technician (dashboard home)
 * - /technician/requests (assigned maintenance requests)
 * - /technician/calendar (work schedule)
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticatedWithRole } from '@/lib/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

interface TechnicianLayoutProps {
  children: React.ReactNode
}

export default function TechnicianLayout({ children }: TechnicianLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is technician
    // If not, redirect to appropriate dashboard
    if (!isAuthenticatedWithRole('technician')) {
      router.replace('/login')
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        {/* Technician-specific content wrapper */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
