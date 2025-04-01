"use client"
import { deleteCookie } from 'cookies-next'
import { auth } from '@/lib/firebase'
import { toast } from 'react-hot-toast'

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function SignOutButton({
  className = "",
  children = "Sign Out",
  onClick
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      await auth.signOut()
      deleteCookie('firebaseToken')
      window.sessionStorage.clear()
      
      if (onClick) onClick()
      window.location.href = '/auth/signin'
      toast.success('Signed out successfully')
    } catch (error: unknown) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className={`w-full text-left ${className}`}
      aria-label="Sign out"
    >
      {children}
    </button>
  )
}