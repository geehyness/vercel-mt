// src/components/AuthForm.tsx
"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from "@/hooks/useAuth"
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

// Validation schemas
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { signIn, signUp, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    try {
      type === 'signup' 
        ? signUpSchema.parse(formData)
        : signInSchema.parse(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message
          return acc
        }, {} as Record<string, string>)
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (type === 'signup') {
        await signUp(formData.name, formData.email, formData.password)
      } else {
        await signIn(formData.email, formData.password)
      }
      router.push(redirect)
    } catch (error: unknown) {
      setErrors({
        form: error instanceof Error ? error.message : 'Authentication failed'
      })
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {type === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-gray-600">
          {type === 'signin' 
            ? 'Sign in to access your account' 
            : 'Get started with your free account'}
        </p>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
            required
            minLength={8}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {type === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : type === 'signin' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {type === 'signin' ? (
          <>
            Don't have an account?{' '}
            <Link
              href={`/auth/signup?redirect=${redirect}`}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              href={`/auth/signin?redirect=${redirect}`}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}