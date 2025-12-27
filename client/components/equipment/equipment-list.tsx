"use client"
import * as React from "react"
import { api } from "@/lib/api"
import { PlusIcon, SearchIcon, FilterIcon, WrenchIcon, PencilIcon, Trash2Icon, BoxIcon, MapPinIcon, UserIcon, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { RequestForm } from "@/components/requests/request-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

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

const EQUIPMENT_COLORS = [
  'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
  'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
  'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200',
  'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
]

export function EquipmentList() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [items, setItems] = React.useState<Equipment[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string>("")
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment | null>(null)
  const [showRequestDialog, setShowRequestDialog] = React.useState(false)
  const [editEquipment, setEditEquipment] = React.useState<Equipment | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteEquipment, setDeleteEquipment] = React.useState<Equipment | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

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
      (item.serial_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.department || "").toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleDelete = (equipment: Equipment) => {
    setDeleteEquipment(equipment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteEquipment) return
    
    try {
      setDeleting(true)
      await api.delete(`/equipment/${deleteEquipment.id}`)
      toast({ description: 'Equipment deleted successfully' })
      setDeleteDialogOpen(false)
      setDeleteEquipment(null)
      fetchEquipment()
    } catch (err: any) {
      toast({ 
        description: err?.message || 'Failed to delete equipment', 
        variant: 'destructive' 
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, serial, or department..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted/50" />
              <CardContent className="space-y-3 pt-6">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEquipment.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BoxIcon className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-1">No equipment found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'Add your first equipment to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((item, index) => (
            <Card 
              key={item.id} 
              className={`group overflow-hidden transition-all hover:shadow-lg border ${EQUIPMENT_COLORS[index % EQUIPMENT_COLORS.length]}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-10 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <BoxIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{item.serial_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/80"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/80 hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="size-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium truncate">{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="size-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium truncate">{item.department}</span>
                  </div>

                  {item.purchase_date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3 flex-shrink-0" />
                      <span>Purchased {new Date(item.purchase_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary" className="font-normal">
                    {getTeamName(item.maintenance_team_id)}
                  </Badge>
                  {item.is_scrapped && (
                    <Badge variant="destructive" className="font-normal">
                      Scrapped
                    </Badge>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 mt-2"
                  onClick={() => handleRequestClick(item)}
                >
                  <WrenchIcon className="size-3.5" />
                  <span>Create Request</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteEquipment?.name}</strong>? This action cannot be undone and will permanently remove the equipment from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

