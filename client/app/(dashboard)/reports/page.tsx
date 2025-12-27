import { Header } from "@/components/header"
import { MaintenanceReports } from "@/components/reports/maintenance-reports"

export default function ReportsPage() {
  return (
    <>
      <Header title="Analytics & Reports" />
      <main className="flex-1 p-6 space-y-6">
        <MaintenanceReports />
      </main>
    </>
  )
}
