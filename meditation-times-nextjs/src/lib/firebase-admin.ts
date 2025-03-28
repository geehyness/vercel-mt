// Server-side Firebase Admin SDK
import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_KEY || '{}'
);

// Initialize only once
const adminApp = getApps().length > 0 ? getApp() : initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export const firestore = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);