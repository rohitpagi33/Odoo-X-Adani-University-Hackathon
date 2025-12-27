'use client'

import { EquipmentList } from '@/components/equipment/equipment-list'

export default function ManagerEquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Equipment</h1>
        <p className="text-muted-foreground mt-2">Equipment assigned to your team</p>
      </div>
      <EquipmentList />
    </div>
  )
}
