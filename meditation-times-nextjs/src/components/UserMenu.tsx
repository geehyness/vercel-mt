// components/UserMenu.tsx
"use client"
import { useAuth } from './AuthProvider'
import { useState, useEffect, useRef } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function UserMenu() {
  const { user, appUser, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted || loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
  }

  const getInitials = (name?: string | null): string => {
    return name?.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {user ? (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1"
            aria-expanded={isOpen}
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                {getInitials(user.displayName)}
              </div>
            )}
            <ChevronDown className={`w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/signin" className="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
          Sign In
        </Link>
      )}
    </div>
  )
}