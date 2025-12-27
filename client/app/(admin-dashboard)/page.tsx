/**
 * ADMIN DASHBOARD - Main Page
 * 
 * Route: /admin
 * Access: Admin only
 * 
 * Purpose: 
 * Main overview page for admins with system-wide statistics and controls
 * 
 * Features shown here:
 * - Total equipment count
 * - Total maintenance requests
 * - Total users in system
 * - Total teams
 * - System health status
 * - Recent activities
 * - Quick action buttons
 * 
 * Sub-routes available:
 * - /admin/equipment - Manage all equipment
 * - /admin/teams - Manage teams and members
 * - /admin/users - Create/manage users (all roles)
 * - /admin/requests - View all maintenance requests
 * - /admin/calendar - System-wide maintenance calendar
 * - /admin/reports - Generate system reports
 * 
 * Component Structure:
 * <AdminDashboard>
 *   ├── <DashboardHeader /> (title + quick actions)
 *   ├── <StatsGrid />
 *   │   ├── <StatCard label="Equipment" value={totalEquipment} />
 *   │   ├── <StatCard label="Requests" value={totalRequests} />
 *   │   ├── <StatCard label="Users" value={totalUsers} />
 *   │   └── <StatCard label="Teams" value={totalTeams} />
 *   ├── <RecentActivities />
 *   └── <SystemHealth />
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'

/**
 * Types for dashboard data
 */
interface DashboardStats {
  totalEquipment: number
  totalRequests: number
  totalUsers: number
  totalTeams: number
  pendingRequests: number
  overdueRequests: number
}

export default function AdminDashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    totalRequests: 0,
    totalUsers: 0,
    totalTeams: 0,
    pendingRequests: 0,
    overdueRequests: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  /**
   * Fetch dashboard statistics on component mount
   * TODO: Implement API calls
   * GET /api/stats/dashboard (admin)
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/stats/dashboard', {
        //   headers: { Authorization: `Bearer ${getToken()}` }
        // })
        // const data = await response.json()
        // setStats(data)

        // Temporary mock data
        setStats({
          totalEquipment: 24,
          totalRequests: 156,
          totalUsers: 12,
          totalTeams: 4,
          pendingRequests: 8,
          overdueRequests: 2
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* ========== STATS GRID ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT CARD: Total Equipment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">All assets in system</p>
          </CardContent>
        </Card>

        {/* STAT CARD: Total Requests */}
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

        {/* STAT CARD: Total Users */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        {/* STAT CARD: Total Teams */}
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

      {/* ========== ALERTS SECTION ========== */}
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

      {/* ========== QUICK ACTIONS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QUICK ACTION: Add Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Register new equipment in the system
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </CardContent>
        </Card>

        {/* QUICK ACTION: Add User */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add new admin, manager, or technician
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </CardContent>
        </Card>

        {/* QUICK ACTION: Create Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Form a new maintenance team
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ========== INFO CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INFO: System Performance */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Performance metrics and health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-green-600">142ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <span className="text-sm text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-sm text-green-600">{stats.totalUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* INFO: Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm border-b pb-2">
                <p className="font-medium">New equipment added</p>
                <p className="text-muted-foreground text-xs">2 hours ago</p>
              </div>
              <div className="text-sm border-b pb-2">
                <p className="font-medium">User role updated</p>
                <p className="text-muted-foreground text-xs">4 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Maintenance request completed</p>
                <p className="text-muted-foreground text-xs">6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
