// src/components/AuthErrorBoundary.tsx
"use client"
import { useEffect } from 'react'
import { AuthProvider } from './AuthProvider'

export default function AuthErrorBoundary({
  children,
  onError
}: {
  children: React.ReactNode
  onError: (error: Error) => void
}) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      onError(new Error(event.message))
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [onError])

  return <>{children}</>
}

// Usage in your layout:
<AuthErrorBoundary onError={(error) => console.error('Auth error:', error)}>
  <AuthProvider>
    {children}
  </AuthProvider>
</AuthErrorBoundary>