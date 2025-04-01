// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    appUser: null,
    loading: true,
    error: null
  });

  // Auth state persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return unsubscribe;
  }, []);

  const handleAuthStateChange = async (firebaseUser: User | null) => {
    try {
      if (!firebaseUser) {
        setState({ user: null, appUser: null, loading: false, error: null });
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoURL: firebaseUser.photoURL || '',
        lastLogin: serverTimestamp()
      };

      if (userDoc.exists()) {
        await setDoc(userRef, userData, { merge: true });
      } else {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp()
        });
      }

      setState({
        user: firebaseUser,
        appUser: { 
          ...userData,
          createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        user: null,
        appUser: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication error'
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false
      }));
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }));
    }
  };

  return {
    ...state,
    signInWithGoogle,
    signOut
  };
}