"use client"
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, BoxIcon, MapPinIcon, BuildingIcon, WrenchIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Types for dynamic data
interface Team {
  id: string
  name: string
}

interface Technician {
  id: string
  full_name: string
}

interface Equipment {
  id: string
  name: string
  serial_number: string
  location: string
  department: string
  purchase_date?: string
  warranty_expiry?: string
  maintenance_team_id?: string
  default_technician_id?: string
}

interface EquipmentFormProps {
  equipment?: Equipment | null
  onSuccess?: () => void
}

export function EquipmentForm({ equipment, onSuccess }: EquipmentFormProps) {
  const { toast } = useToast()
  const [purchaseDate, setPurchaseDate] = React.useState<Date>()
  const [warrantyDate, setWarrantyDate] = React.useState<Date>()
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [serial, setSerial] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [department, setDepartment] = React.useState("")
  const [team, setTeam] = React.useState("")
  const [technician, setTechnician] = React.useState("")
  
  // Dynamic data states
  const [teams, setTeams] = React.useState<Team[]>([])
  const [technicians, setTechnicians] = React.useState<Technician[]>([])
  const [loadingTeams, setLoadingTeams] = React.useState(false)
  const [loadingTechnicians, setLoadingTechnicians] = React.useState(false)

  // Load initial values when editing
  React.useEffect(() => {
    if (equipment) {
      setName(equipment.name || "")
      setSerial(equipment.serial_number || "")
      setLocation(equipment.location || "")
      setDepartment(equipment.department || "")
      setTeam(equipment.maintenance_team_id || "")
      setTechnician(equipment.default_technician_id || "")
      if (equipment.purchase_date) {
        setPurchaseDate(new Date(equipment.purchase_date))
      }
      if (equipment.warranty_expiry) {
        setWarrantyDate(new Date(equipment.warranty_expiry))
      }
    }
  }, [equipment])



  // Fetch teams from database
  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true)
        const data = await api.get<Team[]>("/teams")
        setTeams(data || [])
      } catch (error) {
        console.error("Failed to fetch teams:", error)
        toast({ description: "Failed to load teams", variant: "destructive" })
      } finally {
        setLoadingTeams(false)
      }
    }
    fetchTeams()
  }, [toast])

  // Fetch technicians when team is selected
  React.useEffect(() => {
    if (!team) {
      setTechnicians([])
      return
    }

    const fetchTechnicians = async () => {
      try {
        setLoadingTechnicians(true)
        const data = await api.get<Technician[]>(`/teams/${team}/members`)
        setTechnicians(data || [])
        setTechnician("") // Reset technician selection when team changes
      } catch (error) {
        console.error("Failed to fetch technicians:", error)
        toast({ description: "Failed to load team members", variant: "destructive" })
      } finally {
        setLoadingTechnicians(false)
      }
    }
    fetchTechnicians()
  }, [team, toast])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (!name || !serial || !location || !department || !purchaseDate || !team) {
        toast({ description: "Please fill all required fields", variant: "destructive" })
        setSaving(false)
        return
      }
      const body = {
        name,
        serial_number: serial,
        location,
        department,
        purchase_date: purchaseDate.toISOString().slice(0, 10),
        warranty_expiry: warrantyDate ? warrantyDate.toISOString().slice(0, 10) : undefined,
        maintenance_team_id: team,
        default_technician_id: technician || undefined,
      }
      
      if (equipment) {
        // Update existing equipment
        await api.patch(`/equipment/${equipment.id}`, body)
        toast({ description: "Equipment updated successfully" })
      } else {
        // Create new equipment
        await api.post<any>("/equipment", body)
        toast({ description: "Equipment created successfully" })
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        // Reset form only when creating new
        setName("")
        setSerial("")
        setLocation("")
        setDepartment("")
        setTeam("")
        setTechnician("")
        setPurchaseDate(undefined)
        setWarrantyDate(undefined)
      }
    } catch (err: any) {
      toast({ description: err?.message || "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Equipment Details Section */}
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BoxIcon className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Equipment Details</h3>
            <p className="text-sm text-muted-foreground">Basic information about the equipment</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Equipment Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g. HVAC Unit 01" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serial" className="text-sm font-medium">Serial Number *</Label>
            <Input 
              id="serial" 
              placeholder="SN-12345678" 
              value={serial} 
              onChange={(e) => setSerial(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Location & Department Section */}
      <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <MapPinIcon className="size-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Location & Department</h3>
            <p className="text-sm text-muted-foreground">Where and how the equipment is used</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
            <Input 
              id="location" 
              placeholder="e.g. Block A, Floor 2" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="IT Operations">IT Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Warranty & Dates Section */}
      <div className="rounded-lg border bg-gradient-to-br from-emerald-50 to-teal-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CalendarIcon className="size-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Important Dates</h3>
            <p className="text-sm text-muted-foreground">Purchase and warranty information</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Purchase Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal bg-white", !purchaseDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Warranty Expiry</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal bg-white", !warrantyDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {warrantyDate ? format(warrantyDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={warrantyDate} onSelect={setWarrantyDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Team & Technician Section */}
      <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-yellow-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <WrenchIcon className="size-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Maintenance Assignment</h3>
            <p className="text-sm text-muted-foreground">Assign to team and default technician</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team" className="text-sm font-medium">Maintenance Team *</Label>
            <Select value={team} onValueChange={setTeam} disabled={loadingTeams}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={loadingTeams ? "Loading teams..." : "Select team"} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="technician" className="text-sm font-medium">Default Technician</Label>
            <Select value={technician} onValueChange={setTechnician} disabled={loadingTechnicians || !team}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={loadingTechnicians ? "Loading..." : "Select technician"} />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={saving} size="lg" className="min-w-[140px]">
          {saving ? (
            <>
              <span className="animate-pulse">{equipment ? 'Updating...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              <BoxIcon className="size-4 mr-2" />
              {equipment ? 'Update Equipment' : 'Save Equipment'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
