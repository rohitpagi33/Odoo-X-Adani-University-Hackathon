"use client"
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function EquipmentForm() {
  const { toast } = useToast()
  const [purchaseDate, setPurchaseDate] = React.useState<Date>()
  const [warrantyDate, setWarrantyDate] = React.useState<Date>()
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [serial, setSerial] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [department, setDepartment] = React.useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (!name || !serial || !location || !department || !purchaseDate) {
        toast({ description: "Please fill all required fields", variant: "destructive" })
        return
      }
      const body = {
        name,
        serial_number: serial,
        location,
        department,
        purchase_date: purchaseDate.toISOString().slice(0, 10),
        warranty_expiry: warrantyDate ? warrantyDate.toISOString().slice(0, 10) : undefined,
      }
      const created = await api.post<any>("/equipment", body)
      toast({ description: "Equipment created" })
    } catch (err: any) {
      toast({ description: err?.message || "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="grid gap-6 py-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name</Label>
          <Input id="name" placeholder="e.g. HVAC Unit 01" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial">Serial Number</Label>
          <Input id="serial" placeholder="SN-12345678" value={serial} onChange={(e) => setSerial(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !purchaseDate && "text-muted-foreground")}
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
          <Label>Warranty Expiry</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !warrantyDate && "text-muted-foreground")}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="e.g. Block A, Floor 2" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team">Maintenance Team</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electrical">Electrical Team</SelectItem>
              <SelectItem value="mechanical">Mechanical Team</SelectItem>
              <SelectItem value="hvac">HVAC Specialists</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="technician">Default Technician</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t1">John Smith</SelectItem>
              <SelectItem value="t2">Sarah Connor</SelectItem>
              <SelectItem value="t3">Mike Ross</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Equipment"}</Button>
      </div>
    </form>
  )
}
