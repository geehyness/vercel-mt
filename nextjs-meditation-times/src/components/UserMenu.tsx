"use client"
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import { LogOut, User, Settings, X } from 'lucide-react' // Keep necessary icons
import Link from 'next/link'
import Image from 'next/image'
import './UserMenu.css' // Import the CSS file we will create

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)

    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        event.target &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
        ) {
        setIsOpen(false)
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    }

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscapeKey);
        // Optional: Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = ''; // Restore scroll
    }


    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = ''; // Ensure scroll is restored on unmount
    }
  }, [isOpen])

  if (!mounted || loading) {
    // Simple loading skeleton using CSS
    return <div className="user-menu-loading-skeleton" />
  }

  const getInitials = (name?: string | null): string => {
    return name?.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U'
  }

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  }

  const closeAndNavigate = () => {
      setIsOpen(false);
      // Navigation happens via Link component
  };

  return (
    <div className="user-menu-container"> {/* Simple container */}
      {user ? (
        <>
          {/* Trigger Button - Use classes consistent with other header elements if needed */}
          <button
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)} // Toggle modal state
            className="user-menu-trigger-button" // Style with CSS
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? "user-menu-modal" : undefined}
            title="User Menu"
          >
            {/* User Avatar or Initials */}
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={32} // Keep size appropriate for header
                height={32}
                className="user-menu-avatar-trigger" // Style with CSS
              />
            ) : (
              <div className="user-menu-initials-trigger"> {/* Style with CSS */}
                {getInitials(user.displayName)}
              </div>
            )}
          </button>

          {/* Modal Popup */}
          {isOpen && (
            
            <div
              className="user-menu-modal-overlay" // Style overlay with CSS
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-menu-title"
              id="user-menu-modal"
            >
              <div
                ref={modalRef}
                className="user-menu-modal" // Style modal container with CSS
              >
                {/* === Modal Header (Dark) === */}
                <div className="modal-header">
                   <button
                      onClick={() => setIsOpen(false)}
                      className="modal-close-btn" // Style with CSS
                      aria-label="Close user menu"
                    >
                      <X size={20} /> {/* Icon */}
                    </button>
                    {/* Large Avatar/Initials */}
                    {user.photoURL ? (
                        <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={80}
                        height={80}
                        className="modal-avatar" // Style with CSS
                        />
                    ) : (
                        <div className="modal-initials"> {/* Style with CSS */}
                        {getInitials(user.displayName)}
                        </div>
                    )}
                    {/* User Info */}
                    <h2 id="user-menu-title" className="modal-user-name">{user.displayName || 'User'}</h2>
                    <p className="modal-user-email">{user.email}</p>
                </div>

                {/* === Modal Body (White Card) === */}
                <div className="modal-body">
                    {/* Links */}
                    <Link
                      href="/profile"
                      onClick={closeAndNavigate}
                      className="modal-link" // Style with CSS
                    >
                      <User className="modal-link-icon" size={18} /> {/* Style icon */}
                      Profile
                    </Link>
                    <Link
                      href="/profile/edit"
                      onClick={closeAndNavigate}
                      className="modal-link" // Style with CSS
                    >
                      <Settings className="modal-link-icon" size={18} /> {/* Style icon */}
                      Edit
                    </Link>

                    {/* Sign Out Button */}
                    <div className="modal-signout-section"> {/* Wrapper for potential border */}
                        <button
                            onClick={handleSignOut}
                            className="modal-signout-btn" // Style with CSS
                        >
                            <LogOut className="modal-signout-icon" size={18} /> {/* Style icon */}
                            Sign out
                        </button>
                    </div>
                </div>

              </div> {/* End Modal Box */}
            </div> // End Modal Overlay
          )}
        </>
      ) : (
        // Sign In Button - Style with CSS to match site buttons
        <Link
          href="/auth/signin"
          className="user-menu-signin-button" // Use a consistent button class
        >
          Sign In
        </Link>
      )}
    </div>
  )
}