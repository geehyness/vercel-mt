"use client";

import { useAuth } from "@/components/Providers";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export function UserMenu() {
  const { user } = useAuth(); // Get the authenticated user from Firebase

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out using Firebase
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      {user ? (
        <>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
            Welcome, {user.email}
          </p>
          <SignOutButton /> {/* Use the SignOutButton component */}
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:underline text-sm md:text-base"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}