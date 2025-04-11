// src/app/auth/signin/page.tsx
'use client';
import { AuthForm } from '@/components/AuthForm';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="signin" />
    </div>
    </Suspense>
    
  );
}