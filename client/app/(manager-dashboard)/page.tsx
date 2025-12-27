/**
 * MANAGER DASHBOARD - Main Page
 * 
 * Route: /manager
 * Access: Manager only
 * 
 * Purpose: 
 * Main overview page for managers with team and operational statistics
 * 
 * Features shown here:
 * - Team workload overview
 * - Equipment health status
 * - Pending maintenance requests
 * - Team performance metrics
 * - Preventive maintenance schedule
 * - Quick action buttons
 * 
 * Sub-routes available:
 * - /manager/equipment - Manage team equipment
 * - /manager/teams - Manage team members
 * - /manager/requests - View team requests
 * - /manager/calendar - Team maintenance calendar
 * - /manager/reports - Team reports
 * 
 * Component Structure:
 * <ManagerDashboard>
 *   ├── <DashboardHeader /> (title + quick actions)
 *   ├── <TeamOverview />
 *   ├── <RequestsSummary />
 *   ├── <EquipmentHealth />
 *   └── <TeamPerformance />
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertTriangle } from 'lucide-react'

/**
 * Types for manager dashboard data
 */
interface ManagerStats {
  teamSize: number
  assignedRequests: number
  completedRequests: number
  equipment: number
  criticalEquipment: number
  pendingRequests: number
}

export default function ManagerDashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [stats, setStats] = useState<ManagerStats>({
    teamSize: 0,
    assignedRequests: 0,
    completedRequests: 0,
    equipment: 0,
    criticalEquipment: 0,
    pendingRequests: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  /**
   * Fetch manager dashboard statistics
   * TODO: Implement API calls
   * GET /api/stats/manager (requires manager role)
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/stats/manager', {
        //   headers: { Authorization: `Bearer ${getToken()}` }
        // })
        // const data = await response.json()
        // setStats(data)

        // Temporary mock data
        setStats({
          teamSize: 5,
          assignedRequests: 12,
          completedRequests: 48,
          equipment: 18,
          criticalEquipment: 2,
          pendingRequests: 4
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
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">Team overview and task management</p>
        </div>
      </div>

      {/* ========== TEAM STATS GRID ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT CARD: Team Size */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamSize}</div>
            <p className="text-xs text-muted-foreground">Active technicians</p>
          </CardContent>
        </Card>

        {/* STAT CARD: Assigned Requests */}
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

        {/* STAT CARD: Completed Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        {/* STAT CARD: Equipment Health */}
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

      {/* ========== ALERTS SECTION ========== */}
      {stats.criticalEquipment > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Equipment Alert
            </CardTitle>
            <CardDescription className="text-red-700">
              {stats.criticalEquipment} equipment item(s) require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-red-200">
              View Critical Equipment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========== QUICK ACTIONS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QUICK ACTION: Create Maintenance Request */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Report a new maintenance issue
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>
          </CardContent>
        </Card>

        {/* QUICK ACTION: Assign Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assign Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Assign request to team member
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </CardContent>
        </Card>

        {/* QUICK ACTION: Schedule Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Plan preventive maintenance
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ========== INFO CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INFO: Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>This month's metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Requests Completed</span>
                <span className="text-sm font-bold">{stats.completedRequests}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '72%' }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Avg Resolution Time</span>
                <span className="text-sm">2.5 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* INFO: Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm border-b pb-2">
                <p className="font-medium">Equipment A - Preventive</p>
                <p className="text-muted-foreground text-xs">Tomorrow at 10:00 AM</p>
              </div>
              <div className="text-sm border-b pb-2">
                <p className="font-medium">Equipment B - Inspection</p>
                <p className="text-muted-foreground text-xs">In 3 days</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Equipment C - Service</p>
                <p className="text-muted-foreground text-xs">In 5 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
