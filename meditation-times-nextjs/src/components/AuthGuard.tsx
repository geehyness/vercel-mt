"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, error, initialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('AuthGuard state:', { user, loading, error, initialized, pathname });
    if (!initialized || loading) return;

    if (!user) {
      const redirectUrl = encodeURIComponent(pathname || '/');
      router.push(`/auth/signin?redirect=${redirectUrl}`);
    }
  }, [user, loading, initialized, pathname, router]);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto mt-8 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-700 font-bold">Authentication Error</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}