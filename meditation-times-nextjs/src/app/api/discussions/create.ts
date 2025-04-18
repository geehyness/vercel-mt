import { writeClient } from '@/lib/sanity.client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await writeClient.create(req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ 
      message: error.message || 'Failed to create discussion' 
    });
  }
}