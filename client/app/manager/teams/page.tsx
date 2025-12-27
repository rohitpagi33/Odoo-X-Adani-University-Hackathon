'use client'

import { TeamsList } from '@/components/teams/teams-list'

export default function ManagerTeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
        <p className="text-muted-foreground mt-2">Team members and assignments</p>
      </div>
      <TeamsList />
    </div>
  )
}
