'use client'

import { MaintenanceReports } from '@/components/reports/maintenance-reports'

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
        <p className="text-muted-foreground mt-2">Analytics and performance metrics</p>
      </div>
      <MaintenanceReports />
    </div>
  )
}
