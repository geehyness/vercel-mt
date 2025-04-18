// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AppUser {
  _id: string; // Sanity document ID
  name: string;
  email: string;
  role: string;
  // Add other relevant user properties
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setState(prevState => ({
        ...prevState,
        isAuthenticated: data.authenticated,
        loading: false,
      }));
    } catch (error) {
      console.error("Error checking authentication:", error);
      setState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        loading: false,
        error: 'Failed to check authentication status.',
      }));
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign in failed');
      }

      const userData = await response.json();
      setState(prevState => ({
        ...prevState,
        user: userData,
        isAuthenticated: true,
        loading: false,
      }));
      router.push('/'); // Redirect on successful sign-in
    } catch (error: any) {
      setState(prevState => ({ ...prevState, error: error.message, loading: false }));
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign up failed');
      }

      const userData = await response.json();
      setState(prevState => ({
        ...prevState,
        user: userData,
        isAuthenticated: false, // User needs to sign in after signup
        loading: false,
      }));
      router.push('/auth/signin'); // Redirect to sign-in after successful signup
    } catch (error: any) {
      setState(prevState => ({ ...prevState, error: error.message, loading: false }));
    }
  };

  const signOut = async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Sign out failed:", errorData);
        // Optionally handle the error
      }

      setState({ user: null, loading: false, error: null, isAuthenticated: false });
      router.push('/auth/signin');
    } catch (error) {
      setState(prevState => ({ ...prevState, error: error instanceof Error ? error.message : 'Sign out failed', loading: false }));
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  };
}