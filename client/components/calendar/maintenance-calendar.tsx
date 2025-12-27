"use client"
import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, WrenchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RequestForm } from "@/components/requests/request-form"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { getUser } from "@/lib/auth"

type MaintenanceRequest = {
  id: string
  description: string
  request_type: string
  scheduled_date: string
  status: string
  equipment?: {
    name: string
  }
  technician?: {
    full_name: string
  }
  team?: {
    name: string
  }
}

export function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [events, setEvents] = React.useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = React.useState(true)
  const user = getUser()

  // Fetch maintenance requests based on user role
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await api.get<MaintenanceRequest[]>('/requests')
        if (mounted) setEvents(data)
      } catch (err) {
        console.error('Failed to load calendar events:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold tracking-tight">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 bg-transparent">
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 bg-transparent">
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="ml-2">
                Today
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 font-normal">
              {user?.role === 'technician' ? 'My Tasks' : user?.role === 'manager' ? 'Team Tasks' : 'All Tasks'}
            </Badge>
            {loading && (
              <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-slate-100 font-normal">
                Loading...
              </Badge>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <PlusIcon className="size-4" />
                  Schedule PM
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule Preventive Maintenance</DialogTitle>
                </DialogHeader>
                <RequestForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {calendarDays.map((day, idx) => {
            const dayEvents = events.filter((ev) => {
              const eventDate = new Date(ev.scheduled_date)
              return isSameDay(eventDate, day)
            })
            const isCurrentMonth = isSameMonth(day, monthStart)

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b relative group transition-colors hover:bg-muted/10",
                  !isCurrentMonth && "bg-muted/20 text-muted-foreground/50",
                  idx % 7 === 6 && "border-r-0",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                      isSameDay(day, new Date()) && "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground"
                        aria-label="Add maintenance request"
                      >
                        <PlusIcon className="size-3" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Schedule for {format(day, "PPP")}</DialogTitle>
                      </DialogHeader>
                      <RequestForm />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayEvents.map((event) => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "border rounded px-1.5 py-0.5 text-[10px] cursor-pointer transition-colors",
                          event.request_type === 'Preventive' 
                            ? "bg-blue-50 border-blue-100 hover:bg-blue-100" 
                            : "bg-orange-50 border-orange-100 hover:bg-orange-100"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1 font-semibold truncate",
                            event.request_type === 'Preventive' ? "text-blue-700" : "text-orange-700"
                          )}>
                            <WrenchIcon className="size-2" />
                            {event.equipment?.name || 'Equipment'}
                          </div>
                          <div className={cn(
                            "truncate text-[9px]",
                            event.request_type === 'Preventive' ? "text-blue-600" : "text-orange-600"
                          )}>
                            {event.request_type}
                          </div>
                          <div className={cn(
                            "truncate",
                            event.request_type === 'Preventive' ? "text-blue-500" : "text-orange-500"
                          )}>
                            {event.technician?.full_name || 'Unassigned'}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="space-y-1">
                          <p className="font-bold">{event.description}</p>
                          <p className="text-[10px] opacity-80">Type: {event.request_type}</p>
                          <p className="text-[10px] opacity-80">Equipment: {event.equipment?.name || 'N/A'}</p>
                          <p className="text-[10px] opacity-80">Team: {event.team?.name || 'Unassigned'}</p>
                          <p className="text-[10px] opacity-80">Technician: {event.technician?.full_name || 'Unassigned'}</p>
                          <p className="text-[10px] opacity-80">Status: {event.status}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
