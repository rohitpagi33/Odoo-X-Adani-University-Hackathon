"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

type Technician = {
  id: string
  full_name: string
  email: string
}

export function TeamForm() {
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
      const res = await api.post<any>('/teams', {
        name,
        description: description || undefined,
        manager_id: managerId || undefined,
        members,
      })
      toast({ description: 'Team created successfully' })
      setName('')
      setDescription('')
      setManagerId('')
      setSelected({})
    } catch (err: any) {
      toast({ description: err?.message || 'Failed to create team', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electrical Team" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager">Team Manager</Label>
        {loadingMgr ? (
          <div className="text-sm text-muted-foreground">Loading managers...</div>
        ) : managers.length === 0 ? (
          <div className="text-sm text-muted-foreground">No managers available</div>
        ) : (
          <Select value={managerId} onValueChange={setManagerId}>
            <SelectTrigger id="manager">
              <SelectValue placeholder="Select a manager (optional)" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.full_name} ({m.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-3">
        <Label>Assign Technicians</Label>
        {loadingTech ? (
          <div className="text-sm text-muted-foreground">Loading technicians...</div>
        ) : technicians.length === 0 ? (
          <div className="text-sm text-muted-foreground">No technicians available</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {technicians.map((t) => (
              <label key={t.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={!!selected[t.id]}
                  onCheckedChange={(v) => setSelected((s) => ({ ...s, [t.id]: !!v }))}
                />
                <span>{t.full_name}</span>
                <span className="text-xs text-muted-foreground">({t.email})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Team'}</Button>
      </div>
    </form>
  )
}
