'use client'

import { TeamsList } from '@/components/teams/teams-list'
import { TeamForm } from '@/components/teams/team-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminTeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
        <p className="text-muted-foreground mt-2">Manage maintenance teams</p>
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Teams List</TabsTrigger>
          <TabsTrigger value="add">Create Team</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TeamsList />
        </TabsContent>
        <TabsContent value="add">
          <TeamForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
