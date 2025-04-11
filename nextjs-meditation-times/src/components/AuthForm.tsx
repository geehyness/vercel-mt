// src/components/AuthForm.tsx
"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// --- Corrected Import Path ---
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
// --- Import CSS ---
import './AuthForm.css';

// Validation schemas (remain the same)
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
  password: z.string().min(8, "Password needs to be at least 8 characters") // Ensure consistent message
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
  const [errors, setErrors] = useState<Record<string, string | undefined>>({}) // Allow undefined for clearing
  const { signIn, signUp, loading, error: authError } = useAuth() // Use the correct hook, get authError
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear specific field error when user types
    setErrors(prev => ({ ...prev, [name]: undefined, form: undefined })) // Clear form error too
  }

  const validateForm = () => {
    // Clear previous errors before new validation
    setErrors({});
    try {
      if (type === 'signup') {
        signUpSchema.parse(formData);
      } else {
        signInSchema.parse(formData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, curr) => {
          // Use path[0] safely, ensuring it exists
          const fieldName = curr.path[0] as string | undefined;
          if (fieldName) {
            acc[fieldName] = curr.message;
          }
          return acc;
        }, {} as Record<string, string>);
        setErrors(newErrors);
      }
      return false;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors(prev => ({ ...prev, form: undefined })) // Clear previous form error
    if (!validateForm()) return

    let success = false;
    try {
      if (type === 'signup') {
        success = await signUp(formData.name, formData.email, formData.password);
      } else {
        success = await signIn(formData.email, formData.password);
      }

      if (success) {
         router.push(redirect); // Redirect only on success
         router.refresh(); // Refresh layout potentially showing user state
      } else {
         // Error state should be set by the hook, check authError
         // No need to explicitly setErrors here if hook handles it well
      }

    } catch (error: unknown) {
      // This catch block might be redundant if the hook handles errors,
      // but can catch unexpected issues during the call itself.
      console.error("Form submission error:", error);
      setErrors(prev => ({
        ...prev, // Keep field errors if any
        form: error instanceof Error ? error.message : 'Authentication failed'
      }))
    }
  }

  // Use the error state from useAuth hook for form-level errors after submission attempt
  const displayError = errors.form || authError;

  return (
    // --- Use CSS Classes instead of Tailwind ---
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h1 className="auth-form-title">
          {type === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth-form-subtitle">
          {type === 'signin'
            ? 'Sign in to access your account'
            : 'Get started with your free account'}
        </p>
      </div>

      {/* Display combined form/auth error */}
      {displayError && (
        <div className="auth-form-error-message">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {type === 'signup' && (
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <p id="name-error" className="form-error-text">{errors.name}</p>}
          </div>
        )}

        <div className="form-field">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="form-error-text">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            required
            minLength={8}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <p id="password-error" className="form-error-text">{errors.password}</p>}
        </div>

        {type === 'signup' && (
          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              required
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="form-error-text">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="form-submit-button" // Use CSS class
        >
          {loading ? (
            <Loader2 className="form-loading-spinner" /> // Style spinner with CSS
          ) : type === 'signin' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      <div className="auth-form-footer">
        {type === 'signin' ? (
          <>
            Do not have an account?{' '}
            <Link
              href={`/auth/signup?redirect=${redirect}`}
              className="form-link" // Style link with CSS
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              href={`/auth/signin?redirect=${redirect}`}
              className="form-link" // Style link with CSS
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}