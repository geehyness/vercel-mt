// lib/auth.ts
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import { client } from './sanity/client';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { firebaseApp } from './firebase'; // Assuming you have firebaseApp initialized in firebase.ts

interface SanityUser {
  _id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  role: 'user' | 'teacher' | 'admin';
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [sanityUser, setSanityUser] = useState<SanityUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore(firebaseApp); // Get Firestore instance

        // Check if user exists in Sanity based on firebaseUid
        const existingUser = await client.fetch<SanityUser>(
          `*[_type == "user" && firebaseUid == $uid][0]`,
          { uid: firebaseUser.uid }
        );

        if (existingUser) {
          // Fetch role from Firestore
          const roleDoc = await db.collection('roles').doc(firebaseUser.uid).get();
          const firestoreRole = roleDoc.exists ? roleDoc.data()?.role : 'user'; // Default to 'user' if not found

          setSanityUser({ ...existingUser, role: firestoreRole });
        } else {
          // Create new user in Sanity
          const newUser: SanityUser = {
            _type: 'user',
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email || '',
            role: 'user', // Default role for new users
          };
          try {
            const createdUser = await client.create(newUser);
            setSanityUser(createdUser);

            // Create a corresponding document in Firestore for roles
            const roleDocRef = doc(db, 'roles', firebaseUser.uid);
            await setDoc(roleDocRef, { role: 'user' }); // Set default role in Firestore
          } catch (error) {
            console.error('Error creating Sanity user:', error);
            setSanityUser(null);
          }
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setSanityUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, sanityUser, loading };
};