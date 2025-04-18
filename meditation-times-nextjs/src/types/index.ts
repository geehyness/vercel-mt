// src/types/index.ts
export interface AppUser {
    _id: string
    name: string
    email: string
    role: 'user' | 'admin'
    emailVerified?: boolean
    createdAt?: string
    updatedAt?: string
  }
  
  export interface AuthState {
    user: AppUser | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
  }