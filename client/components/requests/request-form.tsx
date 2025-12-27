"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Technician {
  id: string
  full_name: string
  email?: string
  role?: string
}

interface Team {
  id: string
  name: string
  members?: Technician[]
}

interface Equipment {
  id: string
  name: string
  maintenance_team_id?: string
  default_technician_id?: string
}

interface RequestFormProps {
  equipment?: Equipment
  onSuccess?: () => void
}

export function RequestForm({ equipment, onSuccess }: RequestFormProps) {
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState("medium")
  const [requestType, setRequestType] = React.useState("maintenance")
  const [duration, setDuration] = React.useState("2")
  const [scheduledDate, setScheduledDate] = React.useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [selectedEquipment, setSelectedEquipment] = React.useState(equipment?.id || "")
  const [team, setTeam] = React.useState(equipment?.maintenance_team_id || "")
  const [technician, setTechnician] = React.useState(equipment?.default_technician_id || "")

  // Dynamic data states
  const [equipmentList, setEquipmentList] = React.useState<Equipment[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [technicians, setTechnicians] = React.useState<Technician[]>([])
  const [loadingEquipment, setLoadingEquipment] = React.useState(false)
  const [loadingTeams, setLoadingTeams] = React.useState(false)

  // Fetch equipment and teams on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingEquipment(true)
        setLoadingTeams(true)
        const [eqData, teamData] = await Promise.all([
          api.get<Equipment[]>("/equipment"),
          api.get<Team[]>("/teams"),
        ])
        setEquipmentList(eqData || [])
        setTeams(teamData || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({ description: "Failed to load form data", variant: "destructive" })
      } finally {
        setLoadingEquipment(false)
        setLoadingTeams(false)
      }
    }
    fetchData()
  }, [toast])

  // Update technicians when team changes
  React.useEffect(() => {
    if (!team) {
      setTechnicians([])
      return
    }

    // Find the selected team and get its members
    const selectedTeam = teams.find(t => t.id === team)
    if (selectedTeam?.members) {
      setTechnicians(selectedTeam.members)
    } else {
      setTechnicians([])
    }
  }, [team, teams])

  // When equipment selection changes, auto-select its team
  const handleEquipmentChange = (eqId: string) => {
    setSelectedEquipment(eqId)
    const selected = equipmentList.find(e => e.id === eqId)
    if (selected?.maintenance_team_id) {
      setTeam(selected.maintenance_team_id)
      setTechnician(selected.default_technician_id || "")
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (!description || !selectedEquipment || !team) {
        toast({ description: "Please fill required fields", variant: "destructive" })
        setSaving(false)
        return
      }

      const body = {
        equipment_id: selectedEquipment,
        description,
        priority,
        request_type: requestType,
        duration: parseFloat(duration) || 2,
        scheduled_date: scheduledDate,
        maintenance_team_id: team,
        technician_id: technician || undefined,
      }

      await api.post("/requests", body)
      
      toast({ description: "✓ Request created successfully!", variant: "default" })
      
      // Reset form
      setDescription("")
      setPriority("medium")
      setRequestType("maintenance")
      setDuration("2")
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      setScheduledDate(now.toISOString().slice(0, 16))
      setTechnician("")
      if (!equipment) {
        setSelectedEquipment("")
        setTeam("")
      }

      // Call success callback to close dialog
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 500)
    } catch (err: any) {
      console.error("Request creation error:", err)
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create request";
      toast({ description: `✗ ${errorMessage}`, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="grid gap-4 py-4" onSubmit={onSubmit}>
      {equipment && (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <p className="text-sm font-medium text-blue-900">
            Creating request for: <span className="font-bold">{equipment.name}</span>
          </p>
        </div>
      )}

      {!equipment && (
        <div className="space-y-2">
          <Label htmlFor="equipment">Equipment</Label>
          <Select value={selectedEquipment} onValueChange={handleEquipmentChange} disabled={loadingEquipment}>
            <SelectTrigger>
              <SelectValue placeholder={loadingEquipment ? "Loading equipment..." : "Select equipment"} />
            </SelectTrigger>
            <SelectContent>
              {equipmentList.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the maintenance issue or request..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Request Type</Label>
          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
          <Input
            id="scheduledDate"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={(() => {
              const now = new Date()
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
              return now.toISOString().slice(0, 16)
            })()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (hours)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team">Assign Team</Label>
          <Select value={team} onValueChange={setTeam} disabled={loadingTeams}>
            <SelectTrigger>
              <SelectValue placeholder={loadingTeams ? "Loading..." : "Select team"} />
            </SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="technician">Assign Technician</Label>
          <Select value={technician} onValueChange={setTechnician} disabled={!team || technicians.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={!team ? "Select a team first" : technicians.length === 0 ? "No technicians in this team" : "Select technician (optional)"} />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={() => onSuccess?.()}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Request"}</Button>
      </div>
    </form>
  )
}
