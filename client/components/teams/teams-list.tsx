"use client"
import * as React from 'react'
import { api } from '@/lib/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TeamForm } from './team-form'
import { PencilIcon } from 'lucide-react'

type Team = {
  id: string
  name: string
  description?: string
  manager_id?: string
  manager?: {
    id: string
    full_name: string
    email: string
  }
  members?: Array<{ id: string; full_name: string; email: string }>
  created_at?: string
}

export function TeamsList() {
  const [items, setItems] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [editTeam, setEditTeam] = React.useState<Team | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const fetchTeams = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get<Team[]>('/teams')
      setItems(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load teams')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const handleEdit = (team: Team) => {
    setEditTeam(team)
    setDialogOpen(true)
  }

  const handleSuccess = () => {
    setDialogOpen(false)
    setEditTeam(null)
    fetchTeams()
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Loading teams...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-rose-600">{error}</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No teams found.</TableCell>
              </TableRow>
            ) : (
              items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.description || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.manager ? t.manager.full_name : '—'}
                  </TableCell>
                  <TableCell>
                    {(t.members?.length || 0)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.created_at?.slice(0, 10) || '—'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      onClick={() => handleEdit(t)}
                      className="h-8 w-8"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <TeamForm team={editTeam} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  </>
  )
}
