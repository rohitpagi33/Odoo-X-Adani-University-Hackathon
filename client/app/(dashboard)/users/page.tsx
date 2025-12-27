import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserForm } from '@/components/users/user-form'
import { UsersList } from '@/components/users/users-list'

export default function UsersPage() {
  return (
    <>
      <Header title="Users" />
      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersList />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
