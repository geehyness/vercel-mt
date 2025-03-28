'use client';

import { deleteCookie } from 'cookies-next';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function SignOutButton({
  className = "",
  children = "Sign Out",
  onClick
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      deleteCookie('firebaseToken');
      
      // Clear client-side cache
      window.sessionStorage.clear();
      
      // Optional: Execute passed onClick handler
      if (onClick) onClick();
      
      // Force a full page reload to reset all state
      window.location.href = '/auth/signin';
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`w-full text-left ${className}`}
      aria-label="Sign out"
    >
      {children}
    </button>
  );
}