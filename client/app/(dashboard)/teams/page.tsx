import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TeamForm } from '@/components/teams/team-form'
import { TeamsList } from '@/components/teams/teams-list'

export default function TeamsPage() {
  return (
    <>
      <Header title="Teams" />
      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamsList />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
