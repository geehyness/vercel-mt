// components/AuthForm.tsx
"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { Loader2 } from 'lucide-react'

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { 
    loading, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle 
  } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (type === 'signup') {
        await signUpWithEmail(email, password, name)
      } else {
        await signInWithEmail(email, password)
      }
      router.push(searchParams.get('redirect') || '/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Authentication failed')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      await signInWithGoogle()
      router.push(searchParams.get('redirect') || '/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Google authentication failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'signin' ? 'Sign In' : 'Sign Up'}
      </h2>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : type === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-2 rounded hover:bg-gray-50"
      >
        <FcGoogle size={20} />
        {type === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
      </button>

      <div className="mt-4 text-center">
        <Link
          href={type === 'signin' ? '/auth/signup' : '/auth/signin'}
          className="text-blue-600 hover:underline"
        >
          {type === 'signin'
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Link>
      </div>
    </div>
  )
}