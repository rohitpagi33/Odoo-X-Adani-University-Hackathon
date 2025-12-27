/**
 * LOGIN PAGE
 * 
 * Route: /login
 * Access: Public (no authentication required)
 * 
 * Purpose:
 * Authenticate users and handle role-based redirect
 * 
 * Features:
 * - Email and password form
 * - Form validation
 * - API call to backend /auth/login
 * - Store token and user data in localStorage
 * - Role-based redirect:
 *   - admin → /admin
 *   - manager → /manager
 *   - technician → /technician
 * 
 * Backend API:
 * POST /auth/login
 * Body: { email: string, password: string }
 * Response: { id, email, full_name, role, token }
 */

"use client"
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { setToken, setUser, getDashboardRoute, type User } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  /**
   * Handle login form submission
   * 
   * Flow:
   * 1. Call API with email and password
   * 2. Receive user object with role and token
   * 3. Store token and user data in localStorage
   * 4. Get dashboard route based on role
   * 5. Redirect to role-specific dashboard
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Call login API
      // Response should include: { id, email, full_name, role, token }
      const res = await api.post<User>("/auth/login", { email, password })

      if (res && res.token && res.role) {
        // Store token in localStorage
        setToken(res.token)

        // Store complete user object in localStorage
        setUser({
          id: res.id,
          email: res.email,
          full_name: res.full_name,
          role: res.role,
          token: res.token
        })

        // Show success message
        toast({ 
          description: `Welcome ${res.full_name}! Redirecting to dashboard...` 
        })

        // Get dashboard route based on role
        const dashboardRoute = getDashboardRoute()

        // Redirect to role-specific dashboard
        // Use router.replace() instead of router.push() to avoid back button issues
        router.replace(dashboardRoute)
        return
      }

      // Login failed
      toast({ 
        description: 'Login failed. Please check your credentials.',
        variant: 'destructive' 
      })
    } catch (err: any) {
      toast({ 
        description: err.message || 'Login failed. Please try again.',
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }


  /**
   * Render login form
   */
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">GearGuard Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the maintenance dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* TEST CREDENTIALS INFO */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900">Test Credentials:</p>
            <p className="text-xs text-blue-700 mt-1">
              • Admin: admin@gearguard.com
            </p>
            <p className="text-xs text-blue-700">
              • Manager: manager@gearguard.com
            </p>
            <p className="text-xs text-blue-700">
              • Technician: tech@gearguard.com
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
