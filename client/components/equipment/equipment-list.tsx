"use client"
import * as React from "react"
import { api } from "@/lib/api"
import { PlusIcon, SearchIcon, FilterIcon, MoreVerticalIcon, WrenchIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { RequestForm } from "@/components/requests/request-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Equipment = {
  id: string
  name: string
  serial_number: string
  department: string
  assigned_employee?: string
  location: string
  maintenance_team_id?: string
  is_scrapped: boolean
  purchase_date?: string
  warranty_expiry?: string
  default_technician_id?: string
}

type Team = {
  id: string
  name: string
}

export function EquipmentList() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [items, setItems] = React.useState<Equipment[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string>("")
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment | null>(null)
  const [showRequestDialog, setShowRequestDialog] = React.useState(false)
  const [editEquipment, setEditEquipment] = React.useState<Equipment | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)

  const fetchEquipment = React.useCallback(async () => {
    try {
      setLoading(true)
      const [equipmentData, teamsData] = await Promise.all([
        api.get<Equipment[]>("/equipment"),
        api.get<Team[]>("/teams"),
      ])
      setItems(equipmentData)
      setTeams(teamsData)
    } catch (err: any) {
      setError(err?.message || "Failed to load equipment")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  const getTeamName = (teamId?: string) => {
    if (!teamId) return "—"
    const team = teams.find(t => t.id === teamId)
    return team?.name || teamId
  }

  const filteredEquipment = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serial_number || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRequestClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowRequestDialog(true)
  }

  const handleRequestSuccess = () => {
    setShowRequestDialog(false)
    setSelectedEquipment(null)
  }

  const handleEdit = (equipment: Equipment) => {
    setEditEquipment(equipment)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setEditEquipment(null)
    fetchEquipment()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or serial..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <FilterIcon className="size-4" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <PlusIcon className="size-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" suppressHydrationWarning>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <EquipmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {error && (
          <div className="p-3 text-sm text-rose-600">{error}</div>
        )}
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Equipment Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned Team</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading equipment...
                </TableCell>
              </TableRow>
            ) : filteredEquipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No equipment found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEquipment.map((item) => (
              <TableRow key={item.id} className="group transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{item.id}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.serial_number}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell className="text-muted-foreground">{item.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {getTeamName(item.maintenance_team_id)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 relative h-8 px-3"
                      onClick={() => handleRequestClick(item)}
                    >
                      <WrenchIcon className="size-3.5 text-primary" />
                      <span>Requests</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )))
            }
          </TableBody>
        </Table>
      </div>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl" suppressHydrationWarning>
          <DialogHeader>
            <DialogTitle>Create Maintenance Request</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <RequestForm 
              equipment={selectedEquipment} 
              onSuccess={handleRequestSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl" suppressHydrationWarning>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          <EquipmentForm equipment={editEquipment} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

