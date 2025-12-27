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
    if (!isAuthenticatedWithRole('manager')) {
      router.replace('/login')
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
