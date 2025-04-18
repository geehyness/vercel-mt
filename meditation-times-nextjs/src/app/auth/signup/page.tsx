// src/app/auth/signup/page.tsx
'use client';
import { AuthForm } from '@/components/AuthForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="signup" />
    </div>
  );
}