'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { format, isToday } from 'date-fns'

interface TechnicianStats {
  myAssignedRequests: number
  newRequests: number
  inProgressRequests: number
  completedToday: number
  totalCompleted: number
}

interface Task {
  id: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: string
  scheduled_date: string
  request_type: string
  equipment?: {
    name: string
  }
}

export default function TechnicianDashboard() {
  const [stats, setStats] = useState<TechnicianStats>({
    myAssignedRequests: 0,
    newRequests: 0,
    inProgressRequests: 0,
    completedToday: 0,
    totalCompleted: 0
  })

  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const requests = await api.get<Task[]>('/requests')
        
        // Calculate stats
        const totalAssigned = requests.length
        const newRequests = requests.filter(r => r.status === 'pending').length
        const inProgress = requests.filter(r => r.status === 'in_progress').length
        const completedToday = requests.filter(r => 
          r.status === 'completed' && isToday(new Date(r.scheduled_date))
        ).length
        const totalCompleted = requests.filter(r => r.status === 'completed').length

        setStats({
          myAssignedRequests: totalAssigned,
          newRequests: newRequests,
          inProgressRequests: inProgress,
          completedToday: completedToday,
          totalCompleted: totalCompleted
        })

        // Filter today's tasks (pending and in-progress)
        const todayTasks = requests.filter(r => 
          (r.status === 'pending' || r.status === 'in_progress') &&
          isToday(new Date(r.scheduled_date))
        )
        setMyTasks(todayTasks)
      } catch (error) {
        console.error('Failed to fetch technician data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'new'
      case 'in_progress': return 'in-progress'
      case 'completed': return 'completed'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.full_name || 'Technician'}</h1>
        <p className="text-muted-foreground mt-2">Your assigned tasks and work status</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myAssignedRequests}</div>
              <p className="text-xs text-muted-foreground">Total tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgressRequests}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="h-5 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-24" />
                </div>
              ))}
            </div>
          ) : myTasks.length === 0 ? (
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
                    <p className="font-medium">{task.equipment?.name || 'Equipment'} - {task.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(task.scheduled_date), 'PPp')} • {task.request_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{task.priority}</Badge>
                    <Badge>{getStatusLabel(task.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
