"use client"
import * as React from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { PencilIcon, SearchIcon, MailIcon, CalendarIcon, ShieldIcon, UserIcon, CrownIcon, Trash2Icon } from 'lucide-react'
import { UserForm } from './user-form'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

type User = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'technician'
  created_at?: string
}

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: CrownIcon,
  },
  manager: {
    label: 'Manager',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ShieldIcon,
  },
  technician: {
    label: 'Technician',
    color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: UserIcon,
  },
}

export function UsersList() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [editUser, setEditUser] = React.useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteUser, setDeleteUser] = React.useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get<User[]>('/auth/users')
      setItems(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await api.get<User[]>('/auth/users')
        if (mounted) setItems(data)
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load users')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setEditUser(null)
    fetchUsers()
  }

  const handleDelete = (user: User) => {
    setDeleteUser(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteUser) return
    
    try {
      setDeleting(true)
      await api.delete(`/auth/users/${deleteUser.id}`)
      toast({ description: 'User deleted successfully' })
      setDeleteDialogOpen(false)
      setDeleteUser(null)
      fetchUsers()
    } catch (err: any) {
      toast({ 
        description: err?.message || 'Failed to delete user', 
        variant: 'destructive' 
      })
    } finally {
      setDeleting(false)
    }
  }

  const filteredUsers = items.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedUsers = {
    admin: filteredUsers.filter(u => u.role === 'admin'),
    manager: filteredUsers.filter(u => u.role === 'manager'),
    technician: filteredUsers.filter(u => u.role === 'technician'),
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or role..."
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
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/50" />
                <CardContent className="space-y-3 pt-6">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <UserIcon className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-1">No users found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try a different search term' : 'Create your first user to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {(['admin', 'manager', 'technician'] as const).map((role) => {
              const users = groupedUsers[role]
              if (users.length === 0) return null
              const config = ROLE_CONFIG[role]
              const RoleIcon = config.icon

              return (
                <div key={role}>
                  <div className="flex items-center gap-2 mb-3">
                    <RoleIcon className="size-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{config.label}s</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {users.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                      <Card 
                        key={user.id} 
                        className={`group overflow-hidden transition-all hover:shadow-lg ${config.color}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Avatar className="size-12 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-white text-primary font-bold text-lg">
                                  {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base leading-tight truncate">
                                  {user.full_name}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={`mt-1 text-xs font-medium ${config.badge}`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEdit(user)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/80"
                              >
                                <PencilIcon className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDelete(user)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/80 hover:text-destructive"
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MailIcon className="size-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{user.email}</span>
                          </div>
                          
                          {user.created_at && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                              <CalendarIcon className="size-3" />
                              <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm user={editUser} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteUser?.full_name}</strong>? This will permanently remove the user and all associated data. This action cannot be undone.
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
    </>
  )
}
