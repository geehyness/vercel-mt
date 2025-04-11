'use client';

import { useAuth } from '@/hooks/useAuth';
import ProfilePage from './page';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfileWrapper() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user?.email) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <Link 
            href="/auth/signin" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign in to view your profile
          </Link>
        </div>
      </div>
    );
  }

  return <ProfilePage email={user.email} />;
}
