"use client"
import * as React from "react"
import { PlusIcon, ClockIcon, AlertCircleIcon, MoreHorizontalIcon, FilterIcon, WrenchIcon, FileIcon, SendIcon } from "lucide-react"
import { format, isBefore } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { RequestForm } from "@/components/requests/request-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getRole } from "@/lib/auth"

type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled" | "delayed"

interface MaintenanceRequest {
  id: string
  description: string
  equipment_name: string
  request_type: "maintenance" | "repair" | "inspection"
  status: RequestStatus
  technician_name?: string
  created_at: string
  scheduled_date: string
  duration: string
  priority: "low" | "medium" | "high"
}

const DISPLAY_STATUS: Record<RequestStatus, string> = {
  "pending": "New",
  "in_progress": "In Progress",
  "completed": "Repaired",
  "cancelled": "Cancelled",
  "delayed": "Delayed",
}

const COLUMNS: RequestStatus[] = ["pending", "delayed", "in_progress", "completed", "cancelled"]

export function MaintenanceKanban() {
  const { toast } = useToast()
  const [requests, setRequests] = React.useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<MaintenanceRequest | null>(null)
  const [targetStatus, setTargetStatus] = React.useState<RequestStatus | null>(null)
  const [statusNotes, setStatusNotes] = React.useState("")
  const [statusFile, setStatusFile] = React.useState<{ base64: string; name: string } | null>(null)
  const [statusSaving, setStatusSaving] = React.useState(false)
  const role = React.useMemo(() => getRole(), [])
  const isTechnician = role === "technician"

  const allowedTransitions = React.useCallback((status: RequestStatus): RequestStatus[] => {
    switch (status) {
      case "pending":
        return ["in_progress", "cancelled", "delayed"]
      case "delayed":
        return ["in_progress", "cancelled"]
      case "in_progress":
        return ["completed", "cancelled"]
      default:
        return []
    }
  }, [])

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get<MaintenanceRequest[]>("/requests")
      setRequests(data || [])
    } catch (error: any) {
      console.error("Failed to fetch requests:", error)
      toast({ description: "Failed to load requests", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch requests from database on mount
  React.useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleRequestSuccess = () => {
    setDialogOpen(false)
    // Refresh requests after successful creation
    setTimeout(() => fetchRequests(), 500)
  }

  const openStatusDialog = (request: MaintenanceRequest, next?: RequestStatus) => {
    setSelectedRequest(request)
    setTargetStatus(next || null)
    setStatusNotes("")
    setStatusFile(null)
    setStatusDialogOpen(true)
  }

  const handleFileChange = (file?: File | null) => {
    if (!file) {
      setStatusFile(null)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setStatusFile({ base64: result, name: file.name })
    }
    reader.readAsDataURL(file)
  }

  const submitStatusChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest || !targetStatus) return
    const requiresReport = targetStatus === "completed" || targetStatus === "cancelled"
    if (requiresReport && (!statusNotes || !statusFile)) {
      toast({ description: "Notes and PDF report are required", variant: "destructive" })
      return
    }

    try {
      setStatusSaving(true)
      await api.patch(`/requests/${selectedRequest.id}/status`, {
        status: targetStatus,
        work_notes: statusNotes,
        report_base64: statusFile?.base64,
        report_filename: statusFile?.name,
      })
      toast({ description: "Status updated" })
      setStatusDialogOpen(false)
      setSelectedRequest(null)
      setTargetStatus(null)
      setStatusFile(null)
      setStatusNotes("")
      fetchRequests()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update status"
      toast({ description: msg, variant: "destructive" })
    } finally {
      setStatusSaving(false)
    }
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
            {!isTechnician && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <RequestForm onSuccess={handleRequestSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 w-full overflow-y-hidden">
          <div className="flex gap-6 p-6 min-h-[calc(100vh-12rem)] w-max md:w-full md:min-w-full">
            {COLUMNS.map((status) => (
              <div
                key={status}
                className="flex flex-col w-80 shrink-0 group"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{DISPLAY_STATUS[status]}</h3>
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
                      <KanbanCard key={req.id} request={req} onUpdate={() => openStatusDialog(req)} />
                    ))}
                  {requests.filter((req) => req.status === status).length === 0 && (
                    <div className="h-24 border-2 border-dashed border-muted flex items-center justify-center rounded-xl text-xs text-muted-foreground/60 italic">
                      No requests
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={submitStatusChange}>
              <div className="text-sm text-muted-foreground">
                {selectedRequest?.description}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={targetStatus || ''}
                  onChange={(e) => setTargetStatus(e.target.value as RequestStatus)}
                >
                  <option value="" disabled>Select status</option>
                  {selectedRequest && allowedTransitions(selectedRequest.status).map((s) => (
                    <option key={s} value={s}>{DISPLAY_STATUS[s]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="What was done / findings / issues"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><FileIcon className="size-4" /> PDF Report</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
                {statusFile && <p className="text-xs text-muted-foreground">{statusFile.name}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={!targetStatus || statusSaving} className="gap-2">
                  {statusSaving ? "Updating..." : "Update"}
                  <SendIcon className="size-4" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

function KanbanCard({
  request,
  onUpdate,
}: {
  request: MaintenanceRequest
  onUpdate: () => void
}) {
  const scheduledDate = new Date(request.scheduled_date)
  const isOverdue = isBefore(scheduledDate, new Date()) && request.status !== "completed"
  
  // Parse duration - handle both interval string ("02:30:00") and direct strings
  const getDurationHours = (duration: string): string => {
    if (duration.includes(':')) {
      const parts = duration.split(':')
      const hours = parseInt(parts[0]) || 0
      const mins = parseInt(parts[1]) || 0
      if (mins > 0) return `${hours}h ${mins}m`
      return `${hours}h`
    }
    return duration
  }

  return (
    <div
      className={cn(
        "bg-background rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 group",
        request.priority === "high" && "border-rose-200 bg-rose-50/30",
        isOverdue && "border-amber-200 bg-amber-50/30",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold px-1.5 py-0 uppercase tracking-wide",
              request.request_type === "repair"
                ? "text-rose-600 border-rose-200 bg-rose-50"
                : "text-blue-600 border-blue-200 bg-blue-50",
            )}
          >
            {request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)}
          </Badge>
          {isOverdue && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircleIcon className="size-3.5 text-amber-600" />
              </TooltipTrigger>
              <TooltipContent>Overdue</TooltipContent>
            </Tooltip>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" className="size-6 -mr-2 opacity-0 group-hover:opacity-100">
          <MoreHorizontalIcon className="size-3.5" />
        </Button>
      </div>

      <h4 className="font-semibold text-sm mb-1 leading-snug line-clamp-2">{request.description}</h4>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <WrenchIcon className="size-3" />
        <span className="truncate">{request.equipment_name}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-6 border border-background">
                <AvatarFallback className="text-[8px]">
                  {(request.technician_name || "T").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{request.technician_name || "Unassigned"}</TooltipContent>
          </Tooltip>
          <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[60px]">
            {(request.technician_name || "Unassigned").split(" ")[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <ClockIcon className="size-3" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{format(scheduledDate, "MMM d, h:mm a")}</span>
              </TooltipTrigger>
              <TooltipContent>{getDurationHours(request.duration)} duration</TooltipContent>
            </Tooltip>
          </div>
          <Button variant="ghost" size="icon-sm" className="size-6" onClick={onUpdate}>
            <SendIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
