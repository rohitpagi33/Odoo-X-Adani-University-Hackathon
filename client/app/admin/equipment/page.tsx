'use client'

import { EquipmentList } from '@/components/equipment/equipment-list'
import { EquipmentForm } from '@/components/equipment/equipment-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminEquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Management</h1>
        <p className="text-muted-foreground mt-2">Manage all equipment in the system</p>
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Equipment List</TabsTrigger>
          <TabsTrigger value="add">Add Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <EquipmentList />
        </TabsContent>
        <TabsContent value="add">
          <EquipmentForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
