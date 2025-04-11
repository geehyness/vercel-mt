// src/providers/AuthProvider.tsx (or '@/components/AuthProvider.tsx')
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// Ensure this path points to your Sanity user schema definition

// Define the shape of the user object expected in the Auth Context
// This might be simpler than the full SanityUser if your session returns basic info
interface AuthUser {
  _id: string; // Essential: ID used to link to Sanity
  name?: string | null;
  email?: string | null;
  // Add other fields returned by your /api/auth/session endpoint if needed
  // For example, from NextAuth session callback
  role?: string; // Role might come directly from the session
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean; // Is the initial auth check running?
  error: string | null; // Authentication errors (sign in/up)
  isAuthenticated: boolean; // Is the user definitively authenticated?
}

interface AuthContextType extends AuthState {
  // Functions remain the same
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to not authenticated
  const router = useRouter();

  // Memoized function to check auth status with the backend
  const checkAuthStatus = useCallback(async () => {
     console.log('AuthProvider: Checking auth status...');
     // Ensure loading is true ONLY during the initial check or explicit calls
     // setLoading(true); // Usually only set to true initially or during sign-in/up

    try {
      const response = await fetch('/api/auth/session', { // Your backend endpoint
        credentials: 'include', // Important for sending cookies
        headers: { 'Accept': 'application/json' },
      });

      // Even if response is ok, check the content
      if (response.ok) {
         const data = await response.json();
         console.log('AuthProvider: /api/auth/session response:', data);

        if (data.authenticated && data.user?._id) { // Check for authenticated flag and user with _id
          console.log('AuthProvider: User authenticated, setting state.');
          setUser(data.user as AuthUser); // Assuming API returns compatible user object
          setIsAuthenticated(true);
          setError(null);
        } else {
          console.log('AuthProvider: User NOT authenticated according to API.');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
         // Handle non-200 responses (e.g., 401 Unauthorized, 500 Server Error)
         console.log(`AuthProvider: Auth check failed with status ${response.status}`);
         setUser(null);
         setIsAuthenticated(false);
      }

    } catch (err) {
      console.error('AuthProvider: Error during checkAuthStatus fetch:', err);
      setUser(null);
      setIsAuthenticated(false);
      // Optionally set an error state here if needed: setError('Failed to check session');
    } finally {
      // Crucial: Set loading to false only after the check is complete
      console.log('AuthProvider: Auth check finished. Setting loading = false.');
      setLoading(false);
    }
  }, []); // No dependencies needed for this useCallback usually

  // Effect to run the auth check on initial component mount
  useEffect(() => {
    console.log('AuthProvider: Component mounted, initiating auth check.');
    setLoading(true); // Ensure loading is true when check starts
    checkAuthStatus();
  }, [checkAuthStatus]); // Depend on the memoized function

  // --- signIn, signUp, signOut methods (largely unchanged) ---
  // Important: These should also potentially call checkAuthStatus or directly set state
  // based on their API call results for immediate feedback.

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true); // Indicate loading during sign-in attempt
    setError(null);
    try {
      const response = await fetch('/api/auth/signin', { // Your sign-in endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Sign in failed' }));
        throw new Error(errorData.message || 'Sign in failed');
      }
      // Success: update auth status immediately
      await checkAuthStatus(); // Re-check status to get full user object and confirm session
      // setLoading(false); // checkAuthStatus will set loading to false
      return true; // Indicate success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown sign in error');
      setIsAuthenticated(false); // Ensure logged out state on error
      setUser(null);
      setLoading(false); // Stop loading on error
      return false; // Indicate failure
    }
    // 'finally' block removed as checkAuthStatus handles setLoading(false) on success/failure path
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch('/api/auth/signup', { // Your sign-up endpoint
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, password })
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Sign up failed' }));
              throw new Error(errorData.message || 'Sign up failed');
          }
          // Success: sign up often automatically signs in the user
          await checkAuthStatus(); // Verify authentication status after sign up
          return true;
      } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown sign up error');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return false;
      }
  };


  const signOut = async () => {
    setError(null);
    try {
      await fetch('/api/auth/signout', { method: 'POST' }); // Your sign-out endpoint
    } catch (err) {
        console.error("Sign out API error:", err);
        // Proceed to clear state locally even if API fails
    } finally {
        // Always clear local state and redirect
        setUser(null);
        setIsAuthenticated(false);
        console.log('AuthProvider: User signed out, redirecting.');
        // Use router push for client-side navigation
        router.push('/auth/signin'); // Redirect to sign-in page
        // router.refresh(); // May not be needed if state updates cause re-render
    }
  };

  // Provide the state and functions through the context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        checkAuthStatus // Expose if needed elsewhere, e.g., for manual refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext (ensure path is correct in imports)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Return the whole context object
};