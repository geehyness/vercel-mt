'use client'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TeacherPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      {/* Your teacher dashboard content */}
    </div>
  )
}