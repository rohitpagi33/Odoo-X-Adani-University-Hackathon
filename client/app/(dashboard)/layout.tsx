"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { api } from "@/lib/api"
import { getToken } from "@/lib/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const token = getToken()
      if (!token) {
        router.replace("/login")
        return
      }
      try {
        await api.get("/auth/me")
      } catch {
        router.replace("/login")
        return
      }
      if (mounted) setReady(true)
    })()
    return () => {
      mounted = false
    }
  }, [router])

  if (!ready) {
    return null
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}
