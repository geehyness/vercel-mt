"use client"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Loading from "./Loading"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, error, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!initialized || loading) return
    if (!user) {
      const redirectUrl = encodeURIComponent(pathname || '/')
      router.push(`/auth/signin?redirect=${redirectUrl}`)
    }
  }, [user, loading, initialized, pathname, router, error])

  if (!initialized || loading) return <Loading />
  return <>{children}</>
}