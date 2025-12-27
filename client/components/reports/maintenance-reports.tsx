"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart } from "recharts"
import { DownloadIcon, FileTextIcon, FilterIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const teamData = [
  { team: "HVAC", requests: 45, color: "var(--color-hvac)" },
  { team: "Electrical", requests: 32, color: "var(--color-electrical)" },
  { team: "Mechanical", requests: 28, color: "var(--color-mechanical)" },
  { team: "Manufacturing", requests: 54, color: "var(--color-manufacturing)" },
]

const equipmentData = [
  { name: "HVAC Unit 01", value: 12 },
  { name: "Backup Gen", value: 8 },
  { name: "CNC Milling", value: 24 },
  { name: "Conveyor Belt", value: 15 },
]

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
          { label: "Completion Rate", value: "94.2%", desc: "+2.1% from last month" },
          { label: "Avg. Repair Time", value: "3.4h", desc: "-15m from last month" },
          { label: "Preventive Ratio", value: "68%", desc: "Target: >70%" },
          { label: "Overdue Tasks", value: "3", desc: "Critical attention required" },
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
            {[
              { name: "Monthly Maintenance Summary - Nov 2025", date: "2025-11-30", size: "2.4 MB" },
              { name: "Equipment Warranty Audit - Q4", date: "2025-12-05", size: "1.1 MB" },
              { name: "Technician Performance Review", date: "2025-12-12", size: "850 KB" },
            ].map((report) => (
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
                  <Button variant="ghost" size="icon-sm">
                    <DownloadIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
