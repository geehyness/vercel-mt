// src/app/auth/signup/page.tsx
'use client';
import { AuthForm } from '@/components/AuthForm';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="signup" />
    </div>
    </Suspense>
  );
}