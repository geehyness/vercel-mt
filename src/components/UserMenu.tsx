"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function UserMenu() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <>
          <span>Hello, {session.user.name}</span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}