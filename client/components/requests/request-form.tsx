"use client"
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export function RequestForm() {
  const [scheduledDate, setScheduledDate] = React.useState<Date>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [equipment, setEquipment] = React.useState("")
  const [team, setTeam] = React.useState("")

  // Auto-fill logic simulation
  const handleEquipmentChange = (value: string) => {
    setEquipment(value)
    setIsLoading(true)
    // Simulate API call to fetch equipment details
    setTimeout(() => {
      const teamMap: Record<string, string> = {
        "EQ-001": "hvac",
        "EQ-002": "manufacturing",
        "EQ-003": "electrical",
      }
      setTeam(teamMap[value] || "")
      setIsLoading(false)
    }, 600)
  }

  return (
    <form className="grid gap-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Request Type</Label>
          <Select defaultValue="Corrective">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
              <SelectItem value="Preventive">Preventive (Routine)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="What needs fixing?" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipment">Equipment</Label>
          <Select onValueChange={handleEquipmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EQ-001">HVAC Unit - Main Hall</SelectItem>
              <SelectItem value="EQ-002">CNC Milling Machine</SelectItem>
              <SelectItem value="EQ-003">Backup Generator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Maintenance Team</Label>
          <div className="relative">
            <Select value={team} onValueChange={setTeam} disabled={isLoading}>
              <SelectTrigger className={cn(isLoading && "opacity-50")}>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select team"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrical">Electrical Team</SelectItem>
                <SelectItem value="mechanical">Mechanical Team</SelectItem>
                <SelectItem value="hvac">HVAC Specialists</SelectItem>
                <SelectItem value="manufacturing">Manufacturing Team</SelectItem>
              </SelectContent>
            </Select>
            {isLoading && (
              <Loader2Icon className="absolute right-9 top-1/2 -translate-y-1/2 size-4 animate-spin text-primary" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Scheduled Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Estimated Duration (Hrs)</Label>
          <Input id="duration" type="number" placeholder="2.5" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Create Request</Button>
      </div>
    </form>
  )
}
