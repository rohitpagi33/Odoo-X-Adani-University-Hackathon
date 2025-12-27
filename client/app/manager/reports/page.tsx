'use client'

import { MaintenanceReports } from '@/components/reports/maintenance-reports'

export default function ManagerReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Reports</h1>
        <p className="text-muted-foreground mt-2">Team performance and metrics</p>
      </div>
      <MaintenanceReports />
    </div>
  )
}
