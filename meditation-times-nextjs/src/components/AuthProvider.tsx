"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  isAuthenticated: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

interface AppUser {
  uid: string
  email: string
  name: string
  photoURL?: string
  createdAt: string
  lastLogin: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to safely convert Firestore timestamp to ISO string
  const toISOString = (timestamp: any): string => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toISOString()
    }
    if (typeof timestamp === 'string') {
      return timestamp
    }
    return new Date().toISOString()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null)
          setAppUser(null)
          setLoading(false)
          return
        }

        // Get or create user document in Firestore
        const userRef = doc(db, "users", firebaseUser.uid)
        const userDoc = await getDoc(userRef)

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || '',
          lastLogin: serverTimestamp()
        }

        if (userDoc.exists()) {
          await setDoc(userRef, userData, { merge: true })
        } else {
          await setDoc(userRef, {
            ...userData,
            createdAt: serverTimestamp()
          })
        }

        const userSnapshot = await getDoc(userRef)
        const userDataFromDb = userSnapshot.data()

        setUser(firebaseUser)
        setAppUser({
          ...userData,
          createdAt: toISOString(userDataFromDb?.createdAt),
          lastLogin: new Date().toISOString()
        })
      } catch (error) {
        console.error("Auth state change error:", error)
        setUser(null)
        setAppUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      await signInWithPopup(auth, googleProvider)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await firebaseSignOut(auth)
      setUser(null)
      setAppUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    appUser,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}