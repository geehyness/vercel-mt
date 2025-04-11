// src/components/AuthGuard.tsx
"use client"
import { useAuth } from "@/providers/AuthProvider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "./LoadingSpinner"

export default function AuthGuard({
  children,
  requiredRole
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectUrl = encodeURIComponent(pathname || '/')
      router.push(`/auth/signin?redirect=${redirectUrl}`)
    }

    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [loading, isAuthenticated, user, requiredRole, pathname, router])

  if (loading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}