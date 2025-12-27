/**
 * TECHNICIAN DASHBOARD - Main Page
 * 
 * Route: /technician
 * Access: Technician only
 * 
 * Purpose: 
 * Main overview page for technicians with assigned tasks and work status
 * 
 * Features shown here:
 * - My assigned requests/tasks
 * - Today's schedule
 * - Task status (New, In Progress, Completed)
 * - Quick status updates
 * - My performance metrics
 * - Task timer (if in progress)
 * 
 * Sub-routes available:
 * - /technician/requests - Detailed view of all assigned requests
 * - /technician/calendar - Work schedule and calendar
 * 
 * Component Structure:
 * <TechnicianDashboard>
 *   ├── <DashboardHeader /> (greeting + quick info)
 *   ├── <TodaysTasks />
 *   ├── <RequestsByStatus />
 *   ├── <PerformanceMetrics />
 *   └── <QuickActions />
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

/**
 * Types for technician dashboard
 */
interface TechnicianStats {
  myAssignedRequests: number
  newRequests: number
  inProgressRequests: number
  completedToday: number
  totalCompleted: number
}

interface Task {
  id: string
  title: string
  status: 'new' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
}

export default function TechnicianDashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [stats, setStats] = useState<TechnicianStats>({
    myAssignedRequests: 0,
    newRequests: 0,
    inProgressRequests: 0,
    completedToday: 0,
    totalCompleted: 0
  })

  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  /**
   * Fetch technician's assigned tasks and statistics
   * TODO: Implement API calls
   * GET /api/requests/assigned (requires technician role, filters by user ID)
   */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/requests/assigned', {
        //   headers: { Authorization: `Bearer ${getToken()}` }
        // })
        // const data = await response.json()
        // setStats(data.stats)
        // setMyTasks(data.tasks)

        // Temporary mock data
        setStats({
          myAssignedRequests: 6,
          newRequests: 2,
          inProgressRequests: 2,
          completedToday: 1,
          totalCompleted: 28
        })

        setMyTasks([
          {
            id: '1',
            title: 'Replace hydraulic pump',
            status: 'new',
            priority: 'high',
            dueDate: 'Today'
          },
          {
            id: '2',
            title: 'Routine equipment inspection',
            status: 'in-progress',
            priority: 'medium',
            dueDate: 'Today'
          },
          {
            id: '3',
            title: 'Check oil levels',
            status: 'in-progress',
            priority: 'low',
            dueDate: 'Tomorrow'
          }
        ])
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get status badge component
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { label: 'New', variant: 'default' as const, icon: AlertCircle },
      'in-progress': { label: 'In Progress', variant: 'secondary' as const, icon: Clock },
      'completed': { label: 'Completed', variant: 'outline' as const, icon: CheckCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant}>
        {config.icon && <config.icon className="mr-1 h-3 w-3" />}
        {config.label}
      </Badge>
    )
  }

  /**
   * Get priority badge
   */
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'High', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Technician</h1>
        <p className="text-muted-foreground mt-2">Your assigned tasks and work status</p>
      </div>

      {/* ========== QUICK STATS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* STAT: My Assigned Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myAssignedRequests}</div>
            <p className="text-xs text-muted-foreground">Total tasks</p>
          </CardContent>
        </Card>

        {/* STAT: New Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        {/* STAT: In Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgressRequests}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        {/* STAT: Completed Today */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        {/* STAT: Total Completed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* ========== TODAY'S TASKS ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>Your scheduled maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {myTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <p className="text-muted-foreground">No tasks assigned for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                    {task.status !== 'completed' && (
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== INFO CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INFO: Next Task */}
        <Card>
          <CardHeader>
            <CardTitle>Next Task</CardTitle>
            <CardDescription>Your upcoming assignment</CardDescription>
          </CardHeader>
          <CardContent>
            {myTasks.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-base">{myTasks[0].title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Clock className="inline mr-1 h-3 w-3" />
                    Due: {myTasks[0].dueDate}
                  </p>
                </div>
                <Button className="w-full">Start Task</Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming tasks</p>
            )}
          </CardContent>
        </Card>

        {/* INFO: Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
            <CardDescription>This month's summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tasks Completed</span>
                <span className="text-sm font-bold">{stats.totalCompleted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Avg Time/Task</span>
                <span className="text-sm">3.2 hours</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ✓ Great work! You're ahead of target.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== QUICK ACTIONS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ACTION: View All Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">View All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See complete list of assigned requests
            </p>
            <Button variant="outline" className="w-full">
              Go to Requests
            </Button>
          </CardContent>
        </Card>

        {/* ACTION: View Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View your maintenance calendar
            </p>
            <Button variant="outline" className="w-full">
              Open Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
