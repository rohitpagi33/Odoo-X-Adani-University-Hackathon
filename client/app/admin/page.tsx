'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { api } from '@/lib/api'

interface DashboardStats {
  totalEquipment: number
  totalRequests: number
  totalUsers: number
  totalTeams: number
  pendingRequests: number
  overdueRequests: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    totalRequests: 0,
    totalUsers: 0,
    totalTeams: 0,
    pendingRequests: 0,
    overdueRequests: 0
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [equipment, requests, users, teams] = await Promise.all([
          api.get<any[]>("/equipment"),
          api.get<any[]>("/requests"),
          api.get<any[]>("/auth/users"),
          api.get<any[]>("/teams"),
        ])

        const now = Date.now()
        const pending = requests.filter((r) => r.status === 'pending' || r.status === 'delayed').length
        const overdue = requests.filter((r) => {
          const scheduled = new Date(r.scheduled_date || r.scheduledDate || r.date)
          if (Number.isNaN(scheduled.getTime())) return false
          return scheduled.getTime() < now && r.status !== 'completed' && r.status !== 'cancelled'
        }).length

        setStats({
          totalEquipment: equipment.length || 0,
          totalRequests: requests.length || 0,
          totalUsers: users.length || 0,
          totalTeams: teams.length || 0,
          pendingRequests: pending,
          overdueRequests: overdue,
        })
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System overview and management</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">All assets in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingRequests} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
            <p className="text-xs text-muted-foreground">Maintenance teams</p>
          </CardContent>
        </Card>
      </div>

      {stats.overdueRequests > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Overdue Maintenance</CardTitle>
            <CardDescription className="text-red-700">
              {stats.overdueRequests} maintenance request(s) are overdue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-red-200">
              View Overdue Requests
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
