import { Header } from "@/components/header"
import { MaintenanceKanban } from "@/components/requests/maintenance-kanban"

export default function RequestsPage() {
  return (
    <>
      <Header title="Maintenance Requests" />
      <main className="flex-1 overflow-hidden">
        <MaintenanceKanban />
      </main>
    </>
  )
}
