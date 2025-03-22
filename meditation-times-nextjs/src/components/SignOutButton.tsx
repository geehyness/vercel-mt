"use client";

import { deleteCookie } from 'cookies-next';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      deleteCookie('firebaseToken', { path: '/' }); // Clear the Firebase token cookie
      router.push('/auth/signin'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}