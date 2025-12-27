"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CheckIcon, UsersIcon, UserIcon, MailIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Technician = {
  id: string
  full_name: string
  email: string
}

type Team = {
  id: string
  name: string
  description?: string
  manager_id?: string
  members?: Array<{ id: string }>
}

interface TeamFormProps {
  team?: Team | null
  onSuccess?: () => void
}

export function TeamForm({ team, onSuccess }: TeamFormProps) {
  const { toast } = useToast()
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [managerId, setManagerId] = React.useState<string>('')
  const [technicians, setTechnicians] = React.useState<Technician[]>([])
  const [managers, setManagers] = React.useState<Technician[]>([])
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [saving, setSaving] = React.useState(false)
  const [loadingTech, setLoadingTech] = React.useState(true)
  const [loadingMgr, setLoadingMgr] = React.useState(true)

  // Load initial values when editing
  React.useEffect(() => {
    if (team) {
      setName(team.name || '')
      setDescription(team.description || '')
      setManagerId(team.manager_id || '')
      
      // Pre-select team members
      const memberIds: Record<string, boolean> = {}
      team.members?.forEach(m => {
        memberIds[m.id] = true
      })
      setSelected(memberIds)
    }
  }, [team])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoadingTech(true)
        const data = await api.get<Technician[]>('/teams/technicians')
        if (mounted) setTechnicians(data)
      } catch (err) {
        toast({ description: 'Failed to load technicians', variant: 'destructive' })
      } finally {
        setLoadingTech(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [toast])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoadingMgr(true)
        const data = await api.get<Technician[]>('/teams/managers')
        if (mounted) setManagers(data)
      } catch (err) {
        toast({ description: 'Failed to load managers', variant: 'destructive' })
      } finally {
        setLoadingMgr(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [toast])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast({ description: 'Team name is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const members = Object.keys(selected).filter((id) => selected[id])
      const payload = {
        name,
        description: description || undefined,
        manager_id: managerId || undefined,
        members,
      }
      
      if (team) {
        // Update existing team
        await api.patch(`/teams/${team.id}`, payload)
        toast({ description: 'Team updated successfully' })
      } else {
        // Create new team
        await api.post('/teams', payload)
        toast({ description: 'Team created successfully' })
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        setName('')
        setDescription('')
        setManagerId('')
        setSelected({})
      }
    } catch (err: any) {
      toast({ description: err?.message || `Failed to ${team ? 'update' : 'create'} team`, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UsersIcon className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Team Information</h3>
            <p className="text-sm text-muted-foreground">Basic details about the team</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Team Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Electrical Team"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of team responsibilities..."
              className="bg-white min-h-[80px] resize-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <UserIcon className="size-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Team Manager</h3>
            <p className="text-sm text-muted-foreground">Assign a manager to lead this team</p>
          </div>
        </div>

        {loadingMgr ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading managers...</div>
          </div>
        ) : managers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No managers available
            </CardContent>
          </Card>
        ) : (
          <Select value={managerId} onValueChange={setManagerId}>
            <SelectTrigger id="manager" className="bg-white">
              <SelectValue placeholder="Select a manager (optional)" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                        {m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.full_name}</span>
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-lg border bg-gradient-to-br from-emerald-50 to-teal-50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <UsersIcon className="size-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Team Members</h3>
            <p className="text-sm text-muted-foreground">Select technicians to add to this team</p>
          </div>
        </div>

        {loadingTech ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading technicians...</div>
          </div>
        ) : technicians.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No technicians available
            </CardContent>
          </Card>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between bg-white h-auto min-h-[2.5rem] py-2"
              >
                <div className="flex flex-wrap gap-1">
                  {Object.keys(selected).filter(id => selected[id]).length === 0 ? (
                    <span className="text-muted-foreground">Select technicians</span>
                  ) : (
                    <>
                      {technicians
                        .filter(t => selected[t.id])
                        .slice(0, 2)
                        .map(t => (
                          <Badge key={t.id} variant="secondary" className="gap-1">
                            {t.full_name}
                            <XIcon
                              className="size-3 cursor-pointer hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelected(s => ({ ...s, [t.id]: false }))
                              }}
                            />
                          </Badge>
                        ))}
                      {Object.keys(selected).filter(id => selected[id]).length > 2 && (
                        <Badge variant="secondary">
                          +{Object.keys(selected).filter(id => selected[id]).length - 2} more
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search technicians..." />
                <CommandList>
                  <CommandEmpty>No technicians found.</CommandEmpty>
                  <CommandGroup>
                    {technicians.map((t) => {
                      const isSelected = !!selected[t.id]
                      return (
                        <CommandItem
                          key={t.id}
                          onSelect={() => setSelected(s => ({ ...s, [t.id]: !isSelected }))}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="size-8">
                              <AvatarFallback className={cn(
                                "text-xs",
                                isSelected ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                              )}>
                                {t.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{t.full_name}</div>
                              <div className="text-xs text-muted-foreground truncate">{t.email}</div>
                            </div>
                            {isSelected && (
                              <CheckIcon className="size-4 text-emerald-600" />
                            )}
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
                {Object.keys(selected).filter(id => selected[id]).length > 0 && (
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected({})}
                      className="w-full h-8 text-xs"
                    >
                      Clear All ({Object.keys(selected).filter(id => selected[id]).length} selected)
                    </Button>
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={saving} size="lg" className="min-w-[140px]">
          {saving ? (
            <>
              <span className="animate-pulse">{team ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <UsersIcon className="size-4 mr-2" />
              {team ? 'Update Team' : 'Create Team'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
