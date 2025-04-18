// src/app/auth/signin/page.tsx
'use client';
import { AuthForm } from '@/components/AuthForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="signin" />
    </div>
  );
}