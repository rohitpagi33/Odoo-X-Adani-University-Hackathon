'use client'

import { MaintenanceCalendar } from '@/components/calendar/maintenance-calendar'

export default function AdminCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
        <p className="text-muted-foreground mt-2">System-wide maintenance schedule</p>
      </div>
      <MaintenanceCalendar />
    </div>
  )
}
