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
 * - Email and password form with modern UI
 * - Form validation
 * - API call to backend /auth/login
 * - Store token and user data in localStorage
 * - Forgot password dialog with email
 * - Role-based redirect
 * 
 * Backend API:
 * POST /auth/login
 * POST /auth/forgot-password
 */

"use client"
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { setToken, setUser, getDashboardRoute, type User } from '@/lib/auth'
import { WrenchIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [forgotEmail, setForgotEmail] = React.useState('')
  const [forgotLoading, setForgotLoading] = React.useState(false)
  const [forgotSent, setForgotSent] = React.useState(false)

  /**
   * Handle login form submission
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ 
        description: 'Please enter email and password.',
        variant: 'destructive' 
      })
      return
    }

    setLoading(true)
    try {
      const res = await api.post<any>("/auth/login", { email, password })
      console.log('Login response:', res)

      const userData = res?.user
      const token = res?.token

      if (userData && token && userData.role) {
        setToken(token)
        setUser({
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          token: token
        })

        toast({ 
          description: `Welcome ${userData.full_name}! Redirecting to dashboard...` 
        })

        const dashboardRoute = getDashboardRoute()
        router.replace(dashboardRoute)
        return
      }

      toast({ 
        description: 'Login failed. Please check your credentials.',
        variant: 'destructive' 
      })
    } catch (err: any) {
      console.error('Login error:', err)
      toast({ 
        description: err.message || 'Login failed. Please try again.',
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle forgot password submission
   */
  const onForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) {
      toast({ 
        description: 'Please enter your email address.',
        variant: 'destructive' 
      })
      return
    }

    setForgotLoading(true)
    try {
      await api.post("/auth/forgot-password", { email: forgotEmail })
      setForgotSent(true)
      toast({ 
        description: 'Password reset email sent successfully!' 
      })
      
      // Reset after 3 seconds
      setTimeout(() => {
        setForgotSent(false)
        setForgotEmail('')
      }, 3000)
    } catch (err: any) {
      toast({ 
        description: err.message || 'Failed to send reset email.',
        variant: 'destructive' 
      })
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur relative z-10">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <WrenchIcon className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">GearGuard</CardTitle>
              <p className="text-xs text-slate-400">Maintenance Management System</p>
            </div>
          </div>
          <CardDescription className="text-slate-400 pt-2">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
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
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Reset Password</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Enter your email and we'll send you a link to reset your password
                    </DialogDescription>
                  </DialogHeader>

                  {forgotSent ? (
                    <div className="space-y-4 py-4">
                      <Alert className="bg-green-900/30 border-green-700">
                        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-400 ml-2">
                          Reset email sent! Check your inbox for instructions.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <form onSubmit={onForgotPassword} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="forgot-email" className="text-sm font-medium text-slate-200">
                          Email Address
                        </label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="name@company.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          disabled={forgotLoading}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={forgotLoading}
                      >
                        {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
