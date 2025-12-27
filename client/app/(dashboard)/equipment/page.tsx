import { Header } from "@/components/header"
import { EquipmentList } from "@/components/equipment/equipment-list"

export default function EquipmentPage() {
  return (
    <>
      <Header title="Equipment Management" />
      <main className="flex-1 p-6">
        <EquipmentList />
      </main>
    </>
  )
}
