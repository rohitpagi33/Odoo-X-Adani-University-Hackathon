"use client"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart } from "recharts"
import { DownloadIcon, FileTextIcon, FilterIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"

const chartConfig: ChartConfig = {
  requests: {
    label: "Total Requests",
  },
  hvac: {
    label: "HVAC Team",
    color: "oklch(0.65 0.15 240)",
  },
  electrical: {
    label: "Electrical Team",
    color: "oklch(0.75 0.15 60)",
  },
  mechanical: {
    label: "Mechanical Team",
    color: "oklch(0.6 0.15 180)",
  },
  manufacturing: {
    label: "Manufacturing Team",
    color: "oklch(0.55 0.2 300)",
  },
}

const PIE_COLORS = ["oklch(0.45 0.15 240)", "oklch(0.65 0.15 180)", "oklch(0.75 0.15 60)", "oklch(0.55 0.2 300)"]

export function MaintenanceReports() {
  const [requests, setRequests] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [equipment, setEquipment] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [reqData, teamData, equipmentData] = await Promise.all([
          api.get<any[]>("/requests"),
          api.get<any[]>("/teams"),
          api.get<any[]>("/equipment"),
        ])
        setRequests(reqData || [])
        setTeams(teamData || [])
        setEquipment(equipmentData || [])
      } catch (err) {
        console.error("Failed to load reports data", err)
      }
    }
    load()
  }, [])

  const teamData = useMemo(() => {
    if (!requests.length) return []
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const key = r.maintenance_team_id || "Unassigned"
      counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts).map(([id, count]) => ({
      team: teams.find((t) => t.id === id)?.name || (id === "Unassigned" ? "Unassigned" : id),
      requests: count,
    }))
  }, [requests, teams])

  const equipmentData = useMemo(() => {
    if (!requests.length) return []
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const key = r.equipment_id || "Unknown"
      counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts)
      .map(([id, value]) => ({ name: equipment.find((e) => e.id === id)?.name || id, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
  }, [requests, equipment])

  const total = requests.length || 0
  const completed = requests.filter((r) => r.status === "completed").length
  const completionRate = total ? `${((completed / total) * 100).toFixed(1)}%` : "0%"

  const parseDurationHours = (val: string): number => {
    if (!val) return 0
    if (val.includes(":")) {
      const [h, m] = val.split(":")
      return (parseInt(h || "0") || 0) + (parseInt(m || "0") || 0) / 60
    }
    const num = parseFloat(val)
    return Number.isFinite(num) ? num : 0
  }

  const avgRepairHours = (() => {
    const done = requests.filter((r) => r.status === "completed" && r.duration)
    if (!done.length) return "0h"
    const avg = done.reduce((sum, r) => sum + parseDurationHours(r.duration), 0) / done.length
    return `${avg.toFixed(1)}h`
  })()

  const preventiveRatio = (() => {
    const preventive = requests.filter((r) => r.request_type === "maintenance").length
    return total ? `${((preventive / total) * 100).toFixed(0)}%` : "0%"
  })()

  const overdueTasks = requests.filter((r) => {
    const dt = new Date(r.scheduled_date)
    if (Number.isNaN(dt.getTime())) return false
    return dt.getTime() < Date.now() && r.status !== "completed" && r.status !== "cancelled"
  }).length

  const recentReports = useMemo(() => {
    return requests
      .filter((r) => r.status === "completed" && r.report_url)
      .slice(0, 3)
      .map((r) => ({
        name: r.description || r.request_type || "Completed Request",
        date: (r.status_changed_at || r.updated_at || r.created_at || new Date().toISOString()).split("T")[0],
        size: "PDF",
        url: r.report_url,
      }))
  }, [requests])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">System Performance</h2>
          <p className="text-sm text-muted-foreground">
            Detailed overview of maintenance metrics across your facility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <FilterIcon className="size-4" />
            Time Range
          </Button>
          <Button size="sm" className="gap-2">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completion Rate", value: completionRate, desc: "Completed / total" },
          { label: "Avg. Repair Time", value: avgRepairHours, desc: "Average duration of completed" },
          { label: "Preventive Ratio", value: preventiveRatio, desc: "Maintenance vs total" },
          { label: "Overdue Tasks", value: overdueTasks.toString(), desc: "Past scheduled, still open" },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Requests per Team</CardTitle>
                <CardDescription>Distribution of maintenance load by specialty.</CardDescription>
              </div>
              <Badge variant="outline">Monthly View</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px]">
              <BarChart data={teamData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="team" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" radius={[4, 4, 0, 0]}>
                  {teamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Critical Equipment Failure</CardTitle>
                <CardDescription>Top equipment by breakdown frequency.</CardDescription>
              </div>
              <Badge variant="outline">Last 90 Days</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={{}} className="aspect-square h-[300px] w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={equipmentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {equipmentData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-xs font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Export Tasks</CardTitle>
          <CardDescription>Recently generated reports ready for download.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div key={report.name} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded bg-background flex items-center justify-center border shadow-sm">
                      <FileTextIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">Generated on {report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground">{report.size}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => window.open(report.url, '_blank')}
                      title="Download report"
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No reports with PDFs available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
