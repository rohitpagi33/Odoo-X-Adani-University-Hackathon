"use client"
import * as React from "react"
import { PlusIcon, SearchIcon, FilterIcon, MoreVerticalIcon, WrenchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Static data as per prompt requirements for initial setup
const equipmentData = [
  {
    id: "EQ-001",
    name: "HVAC Unit - Main Hall",
    serialNumber: "HVAC-99281-X",
    department: "Facilities",
    employee: "Michael Scott",
    location: "Floor 1, Block A",
    team: "Climate Control",
    status: "Operational",
    openRequests: 0,
  },
  {
    id: "EQ-002",
    name: "CNC Milling Machine",
    serialNumber: "CNC-7712-B",
    department: "Manufacturing",
    employee: "Dwight Schrute",
    location: "Factory Floor, Line 3",
    team: "Production Tech",
    status: "Breakdown",
    openRequests: 2,
  },
  {
    id: "EQ-003",
    name: "Backup Generator",
    serialNumber: "GEN-5541-G",
    department: "Operations",
    employee: "Jim Halpert",
    location: "Roof Deck",
    team: "Electrical",
    status: "Operational",
    openRequests: 1,
  },
]

export function EquipmentList() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredEquipment = equipmentData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <EquipmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Equipment Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id} className="group transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{item.id}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.serialNumber}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell className="text-muted-foreground">{item.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {item.team}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.status === "Breakdown"
                        ? "bg-rose-500/10 text-rose-600 border-rose-200"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="gap-2 relative h-8 px-3">
                      <WrenchIcon className="size-3.5 text-primary" />
                      <span>Requests</span>
                      {item.openRequests > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                          {item.openRequests}
                        </span>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
