import { auth } from './firebase' // Use the exported auth instance
import { onAuthStateChanged, User } from 'firebase/auth'
import { useState, useEffect } from 'react'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = (): AuthState => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        user,
        loading: false,
        error: null
      })
    })

    return unsubscribe
  }, [])

  return state
}