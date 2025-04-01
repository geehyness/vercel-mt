import { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '@/lib/firebase-admin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Verify the request is authorized
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Example admin operation - get user data
    const user = await adminAuth.getUser(decodedToken.uid)
    
    res.status(200).json({ 
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        customClaims: user.customClaims
      }
    })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error')
    console.error('Admin error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}