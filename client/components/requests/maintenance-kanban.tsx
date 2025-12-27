"use client"
import * as React from "react"
import { PlusIcon, ClockIcon, AlertCircleIcon, MoreHorizontalIcon, FilterIcon, WrenchIcon } from "lucide-react"
import { format, isBefore, startOfToday } from "date-fns"
import { TooltipProvider } from "react-tooltip"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { RequestForm } from "@/components/requests/request-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type RequestStatus = "New" | "In Progress" | "Repaired" | "Scrap"

interface MaintenanceRequest {
  id: string
  subject: string
  equipmentName: string
  type: "Corrective" | "Preventive"
  status: RequestStatus
  technician: {
    name: string
    avatar?: string
  }
  scheduledDate: Date
}

const initialRequests: MaintenanceRequest[] = [
  {
    id: "REQ-001",
    subject: "Compressor Vibration",
    equipmentName: "HVAC Unit - Main Hall",
    type: "Corrective",
    status: "New",
    technician: { name: "John Smith", avatar: "/diverse-user-avatars.png" },
    scheduledDate: new Date(2025, 11, 20),
  },
  {
    id: "REQ-002",
    subject: "Routine Filter Change",
    equipmentName: "Backup Generator",
    type: "Preventive",
    status: "In Progress",
    technician: { name: "Sarah Connor" },
    scheduledDate: new Date(2025, 11, 28),
  },
  {
    id: "REQ-003",
    subject: "Spindle Motor Failure",
    equipmentName: "CNC Milling Machine",
    type: "Corrective",
    status: "New",
    technician: { name: "Mike Ross" },
    scheduledDate: new Date(2025, 11, 25),
  },
]

const COLUMNS: RequestStatus[] = ["New", "In Progress", "Repaired", "Scrap"]

export function MaintenanceKanban() {
  const [requests, setRequests] = React.useState(initialRequests)

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("requestId", id)
  }

  const onDrop = (e: React.DragEvent, status: RequestStatus) => {
    const id = e.dataTransfer.getData("requestId")
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-muted/30">
        <div className="flex items-center justify-between p-6 bg-background border-b">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
              {requests.length} Total Requests
            </Badge>
            <div className="flex items-center -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="size-8 border-2 border-background">
                  <AvatarFallback className="text-[10px]">T{i}</AvatarFallback>
                </Avatar>
              ))}
              <div className="size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                +5
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FilterIcon className="size-4" />
              Group By Team
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <PlusIcon className="size-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Maintenance Request</DialogTitle>
                </DialogHeader>
                <RequestForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="flex-1 w-full overflow-y-hidden">
          <div className="flex gap-6 p-6 min-h-[calc(100vh-12rem)] w-max md:w-full md:min-w-full">
            {COLUMNS.map((status) => (
              <div
                key={status}
                className="flex flex-col w-80 shrink-0 group"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status)}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{status}</h3>
                    <Badge
                      variant="secondary"
                      className="rounded-full h-5 min-w-5 p-0 flex items-center justify-center"
                    >
                      {requests.filter((r) => r.status === status).length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>

                <div className="flex-1 bg-muted/50 rounded-xl p-3 space-y-3 min-h-[500px]">
                  {requests
                    .filter((req) => req.status === status)
                    .map((req) => (
                      <KanbanCard key={req.id} request={req} onDragStart={onDragStart} />
                    ))}
                  {requests.filter((req) => req.status === status).length === 0 && (
                    <div className="h-24 border-2 border-dashed border-muted flex items-center justify-center rounded-xl text-xs text-muted-foreground/60 italic">
                      Drop items here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

function KanbanCard({
  request,
  onDragStart,
}: {
  request: MaintenanceRequest
  onDragStart: (e: React.DragEvent, id: string) => void
}) {
  const isOverdue = isBefore(request.scheduledDate, startOfToday()) && request.status !== "Repaired"

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, request.id)}
      className={cn(
        "bg-background rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group",
        isOverdue && "border-rose-200 bg-rose-50/30",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold px-1.5 py-0 uppercase tracking-wide",
            request.type === "Corrective"
              ? "text-rose-600 border-rose-200 bg-rose-50"
              : "text-blue-600 border-blue-200 bg-blue-50",
          )}
        >
          {request.type}
        </Badge>
        <Button variant="ghost" size="icon-sm" className="size-6 -mr-2 opacity-0 group-hover:opacity-100">
          <MoreHorizontalIcon className="size-3.5" />
        </Button>
      </div>

      <h4 className="font-semibold text-sm mb-1 leading-snug">{request.subject}</h4>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <WrenchIcon className="size-3" />
        <span>{request.equipmentName}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-6 border border-background">
                <AvatarImage src={request.technician.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-[8px]">
                  {request.technician.name.split(" ").map((n) => n[0])}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>Technician: {request.technician.name}</TooltipContent>
          </Tooltip>
          <span className="text-[10px] font-medium text-muted-foreground">{request.technician.name}</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 text-[10px] font-medium",
            isOverdue ? "text-rose-600" : "text-muted-foreground",
          )}
        >
          <ClockIcon className="size-3" />
          {format(request.scheduledDate, "MMM d")}
          {isOverdue && <AlertCircleIcon className="size-3 ml-0.5 fill-rose-600 text-white" />}
        </div>
      </div>
    </div>
  )
}
