"use client";

import { useAuth } from "@/components/Providers";
import Link from "next/link";
import SignOutButton from "./SignOutButton"; // Import the SignOutButton component

export function UserMenu() {
  const { user } = useAuth(); // Get the authenticated user from Firebase

  return (
    <div className="flex items-center gap-4">
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