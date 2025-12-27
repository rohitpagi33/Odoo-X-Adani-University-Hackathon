'use client'

import { UsersList } from '@/components/users/users-list'
import { UserForm } from '@/components/users/user-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">Manage system users and roles</p>
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Users List</TabsTrigger>
          <TabsTrigger value="add">Create User</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <UsersList />
        </TabsContent>
        <TabsContent value="add">
          <UserForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
