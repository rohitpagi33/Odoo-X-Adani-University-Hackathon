/**
 * RESET PASSWORD PAGE
 * 
 * Route: /reset-password
 * Query Params: token, email
 * Access: Public
 * 
 * Purpose:
 * Allow users to reset their password using the token sent via email
 * 
 * Features:
 * - Extract token and email from query params
 * - Validate password requirements
 * - API call to backend /auth/reset-password
 * - Redirect to login on success
 * - Error handling for invalid/expired tokens
 * 
 * Backend API:
 * POST /auth/reset-password
 */

"use client"
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { WrenchIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [resetSuccess, setResetSuccess] = React.useState(false)

  // Validate on mount
  React.useEffect(() => {
    if (!token || !email) {
      toast({
        description: 'Invalid reset link. Please request a new one.',
        variant: 'destructive'
      })
      setTimeout(() => router.push('/login'), 2000)
    }
  }, [token, email, router, toast])

  /**
   * Handle password reset form submission
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      toast({
        description: 'Please enter and confirm your password.',
        variant: 'destructive'
      })
      return
    }

    if (password.length < 6) {
      toast({
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        description: 'Passwords do not match.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword: password,
        token
      })

      setResetSuccess(true)
      toast({
        description: 'Password reset successfully! Redirecting to login...'
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      console.error('Reset password error:', err)
      toast({
        description: err.message || 'Failed to reset password. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Reset Password Card */}
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
            Create a new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {resetSuccess ? (
            <Alert className="bg-green-900/30 border-green-700">
              <CheckCircle2Icon className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400 ml-2">
                Password reset successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* EMAIL DISPLAY */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <div className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-300 text-sm">
                  {decodeURIComponent(email)}
                </div>
              </div>

              {/* NEW PASSWORD FIELD */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* CONFIRM PASSWORD FIELD */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* PASSWORD STRENGTH INDICATOR */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          password.length >= (i + 1) * 2 
                            ? 'bg-blue-600' 
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    {password.length < 6 && 'Password too short'}
                    {password.length >= 6 && password.length < 12 && 'Weak'}
                    {password.length >= 12 && 'Strong'}
                  </p>
                </div>
              )}

              {/* MATCH INDICATOR */}
              {password && confirmPassword && (
                <div className={`text-xs font-medium ${
                  password === confirmPassword 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {password === confirmPassword 
                    ? '✓ Passwords match' 
                    : '✗ Passwords do not match'}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                disabled={loading || !password || !confirmPassword}
                size="lg"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4 border-t border-slate-700">
          {/* BACK TO LOGIN LINK */}
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-slate-200"
            onClick={() => router.push('/login')}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
