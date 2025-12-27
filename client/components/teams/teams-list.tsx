"use client"
import * as React from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TeamForm } from './team-form'
import { PencilIcon, SearchIcon, UsersIcon, UserIcon, CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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

const TEAM_COLORS = [
  'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
  'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
  'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200',
  'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
]

export function TeamsList() {
  const [items, setItems] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
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

  const filteredTeams = items.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="space-y-4">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams by name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        ) : filteredTeams.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <UsersIcon className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-1">No teams found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try a different search term' : 'Create your first team to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team, index) => (
              <Card 
                key={team.id} 
                className={`group overflow-hidden transition-all hover:shadow-lg ${TEAM_COLORS[index % TEAM_COLORS.length]}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-10 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                          <UsersIcon className="size-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{team.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(team)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/80"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {team.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {team.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 pt-2 border-t">
                    {team.manager && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Manager:</span>
                        <span className="font-medium truncate">{team.manager.full_name}</span>
                      </div>
                    )}
                    
                    {team.created_at && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {team.members && team.members.length > 0 && (
                    <div className="flex items-center gap-1 pt-2">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 4).map((member, idx) => (
                          <Avatar key={member.id} className="size-7 border-2 border-background">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {team.members.length > 4 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          +{team.members.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
