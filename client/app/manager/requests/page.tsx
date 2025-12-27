'use client'

import { MaintenanceKanban } from '@/components/requests/maintenance-kanban'
import { RequestForm } from '@/components/requests/request-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ManagerRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Requests</h1>
        <p className="text-muted-foreground mt-2">Your team's maintenance requests</p>
      </div>
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Request Board</TabsTrigger>
          <TabsTrigger value="create">Create Request</TabsTrigger>
        </TabsList>
        <TabsContent value="board">
          <MaintenanceKanban />
        </TabsContent>
        <TabsContent value="create">
          <RequestForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
