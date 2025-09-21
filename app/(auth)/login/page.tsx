'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithWhop } from '@/lib/supabase/auth'
import { toast } from 'sonner'

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const error = searchParams.get('error')

  const handleWhopLogin = async () => {
    try {
      setIsLoading(true)
      await signInWithWhop()
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show error message if redirected from auth failure
  if (error) {
    const errorMessages = {
      auth_error: 'Authentication failed. Please try again.',
      server_error: 'Server error occurred. Please try again later.',
      no_code: 'Authentication was incomplete. Please try again.'
    }
    toast.error(errorMessages[error as keyof typeof errorMessages] || 'An error occurred during login.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Prompt Platform</h1>
          <p className="mt-2 text-gray-600">Discover, save, and share AI prompts</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your saved prompts and discover new ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleWhopLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Signing in...' : 'Continue with Whop'}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}