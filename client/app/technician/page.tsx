'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'

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
  const [stats, setStats] = useState<TechnicianStats>({
    myAssignedRequests: 0,
    newRequests: 0,
    inProgressRequests: 0,
    completedToday: 0,
    totalCompleted: 0
  })

  const [myTasks, setMyTasks] = useState<Task[]>([])

  useEffect(() => {
    setStats({
      myAssignedRequests: 6,
      newRequests: 2,
      inProgressRequests: 2,
      completedToday: 1,
      totalCompleted: 28
    })

    setMyTasks([
      { id: '1', title: 'Replace hydraulic pump', status: 'new', priority: 'high', dueDate: 'Today' },
      { id: '2', title: 'Routine equipment inspection', status: 'in-progress', priority: 'medium', dueDate: 'Today' },
      { id: '3', title: 'Check oil levels', status: 'in-progress', priority: 'low', dueDate: 'Tomorrow' }
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Technician</h1>
        <p className="text-muted-foreground mt-2">Your assigned tasks and work status</p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
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
                    <Badge variant="outline">{task.priority}</Badge>
                    <Badge>{task.status}</Badge>
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
