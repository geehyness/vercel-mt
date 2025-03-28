"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

interface AppUser {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
}

export function useAuth() {
  const [state, setState] = useState({
    user: null as FirebaseUser | null,
    appUser: null as AppUser | null,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setState({ user: null, appUser: null, loading: false, error: null });
          return;
        }

        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Existing user - update last login
          await setDoc(userRef, {
            lastLogin: new Date().toISOString()
          }, { merge: true });
          
          setState({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              metadata: {
                creationTime: firebaseUser.metadata.creationTime,
                lastSignInTime: firebaseUser.metadata.lastSignInTime
              }
            },
            appUser: userDoc.data() as AppUser,
            loading: false,
            error: null
          });
        } else {
          // New user - create document
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          await setDoc(userRef, newUser);

          setState({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              metadata: {
                creationTime: firebaseUser.metadata.creationTime,
                lastSignInTime: firebaseUser.metadata.lastSignInTime
              }
            },
            appUser: newUser,
            loading: false,
            error: null
          });
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        setState({
          user: firebaseUser ? {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            metadata: {
              creationTime: firebaseUser.metadata.creationTime,
              lastSignInTime: firebaseUser.metadata.lastSignInTime
            }
          } : null,
          appUser: null,
          loading: false,
          error: error.message
        });
      }
    });

    return unsubscribe;
  }, []);

  return state;
}