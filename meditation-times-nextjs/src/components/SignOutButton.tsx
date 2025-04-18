// src/components/SignOutButton.tsx
"use client"
import { useAuth } from "@/hooks/useAuth"
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
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onClick) onClick();
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
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