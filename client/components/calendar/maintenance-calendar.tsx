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

// Static data for preventive maintenance events
const events = [
  {
    id: "EV-001",
    date: new Date(2025, 11, 5),
    equipment: "HVAC Unit - Main Hall",
    technician: "John Smith",
    type: "Preventive",
  },
  {
    id: "EV-002",
    date: new Date(2025, 11, 12),
    equipment: "Backup Generator",
    technician: "Sarah Connor",
    type: "Preventive",
  },
  {
    id: "EV-003",
    date: new Date(2025, 11, 15),
    equipment: "CNC Machine 02",
    technician: "Mike Ross",
    type: "Preventive",
  },
  {
    id: "EV-004",
    date: new Date(2025, 11, 22),
    equipment: "HVAC Unit - Main Hall",
    technician: "John Smith",
    type: "Preventive",
  },
]

export function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date(2025, 11, 1)) // Set to Dec 2025 for demo
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

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
              Preventive View Only
            </Badge>
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
            const dayEvents = events.filter((ev) => isSameDay(ev.date, day))
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
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground">
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
                        <div className="bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 text-[10px] cursor-pointer hover:bg-blue-100 transition-colors">
                          <div className="flex items-center gap-1 font-semibold text-blue-700 truncate">
                            <WrenchIcon className="size-2" />
                            {event.equipment}
                          </div>
                          <div className="text-blue-500 truncate">{event.technician}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="space-y-1">
                          <p className="font-bold">{event.equipment}</p>
                          <p className="text-[10px] opacity-80">Technician: {event.technician}</p>
                          <p className="text-[10px] opacity-80">Type: {event.type}</p>
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
