// pages/api/admin/deleteUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '@lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { targetUid } = req.body;

  if (!targetUid) {
    return res.status(400).json({ error: 'Missing targetUid' });
  }

  try {
    await admin.auth().deleteUser(targetUid);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    return res.status(500).json({ error: 'Failed to delete user from Auth' });
  }
}



