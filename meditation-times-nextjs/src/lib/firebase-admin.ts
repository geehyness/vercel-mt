import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth'; // Import getAuth

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = getApp();
const firestore = getFirestore(adminApp);
const adminAuth = getAuth(adminApp); // Initialize Firebase Admin Auth

export { firestore, adminAuth }; // Export adminAuth