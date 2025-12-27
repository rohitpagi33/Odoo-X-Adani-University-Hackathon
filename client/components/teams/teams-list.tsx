"use client"
import * as React from 'react'
import { api } from '@/lib/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await api.get<Team[]>('/teams')
        if (mounted) setItems(data)
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load teams')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">Loading teams...</TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-rose-600">{error}</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No teams found.</TableCell>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
