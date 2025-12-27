'use client'

import { MaintenanceKanban } from '@/components/requests/maintenance-kanban'

export default function TechnicianRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
        <p className="text-muted-foreground mt-2">Your assigned maintenance requests</p>
      </div>
      <MaintenanceKanban />
    </div>
  )
}
