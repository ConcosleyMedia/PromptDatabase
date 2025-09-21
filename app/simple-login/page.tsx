'use client'

import { useState } from 'react'
import { signInWithWhop } from '@/lib/supabase/auth'

export default function SimpleLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleWhopLogin = async () => {
    try {
      setIsLoading(true)
      setError('')
      await signInWithWhop()
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>🎯 Prompt Platform</h1>
      <p>Sign in to access your prompts</p>

      {error && (
        <div style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleWhopLogin}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {isLoading ? 'Signing in...' : 'Continue with Whop'}
      </button>

      <br /><br />
      <a href="/">← Back to Home</a>
    </div>
  )
}