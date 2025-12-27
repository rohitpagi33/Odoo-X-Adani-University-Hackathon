import { Header } from "@/components/header"
import { MaintenanceCalendar } from "@/components/calendar/maintenance-calendar"

export default function CalendarPage() {
  return (
    <>
      <Header title="Maintenance Calendar" />
      <main className="flex-1 p-6">
        <MaintenanceCalendar />
      </main>
    </>
  )
}
