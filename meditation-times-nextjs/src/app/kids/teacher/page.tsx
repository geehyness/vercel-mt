// Teacher portal (protected route)
'use client';
import { useAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function TeacherPortal() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user?.isTeacher) redirect('/auth/signin');

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      {/* Lesson management UI */}
    </main>
  );
}