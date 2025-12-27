'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ManagerStats {
  teamSize: number
  assignedRequests: number
  completedRequests: number
  equipment: number
  criticalEquipment: number
  pendingRequests: number
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<ManagerStats>({
    teamSize: 0,
    assignedRequests: 0,
    completedRequests: 0,
    equipment: 0,
    criticalEquipment: 0,
    pendingRequests: 0
  })

  useEffect(() => {
    setStats({
      teamSize: 5,
      assignedRequests: 12,
      completedRequests: 48,
      equipment: 18,
      criticalEquipment: 2,
      pendingRequests: 4
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">Team overview and task management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamSize}</div>
            <p className="text-xs text-muted-foreground">Active technicians</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedRequests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingRequests} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{stats.criticalEquipment} critical</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
