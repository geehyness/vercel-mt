// src/providers/AuthProvider.tsx
"use client" // This must be at the top
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppUser } from '@/types'

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  })

  const router = useRouter()

 // In your AuthProvider component
const checkAuthStatus = async () => {
  setState(prev => ({ ...prev, loading: true }))
  
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include'
    })

    // First check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check content type before parsing
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response')
    }

    const data = await response.json()
    
    setState({
      user: data.authenticated ? data.user : null,
      loading: false,
      error: null,
      isAuthenticated: data.authenticated
    })
  } catch (error) {
    console.error('Auth check error:', error)
    setState({
      user: null,
      loading: false,
      error: error instanceof Error ? error.message : 'Authentication check failed',
      isAuthenticated: false
    })
  }
}

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Sign in failed')
      }

      const user = await response.json()
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }))
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Sign up failed')
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }))
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })

      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      })
      router.push('/auth/signin')
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to sign out'
      }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}