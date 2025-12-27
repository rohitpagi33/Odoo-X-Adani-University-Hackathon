'use client'

import { MaintenanceCalendar } from '@/components/calendar/maintenance-calendar'

export default function TechnicianCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground mt-2">Your maintenance schedule</p>
      </div>
      <MaintenanceCalendar />
    </div>
  )
}
