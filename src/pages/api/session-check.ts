import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { mobile, sessionToken } = req.body;
  if (!mobile || !sessionToken) {
    return res.status(400).json({ error: 'Missing mobile or sessionToken' });
  }
  await dbConnect();
  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(404).json({ valid: false });
  }
  if (user.sessionToken === sessionToken) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(200).json({ valid: false });
  }
}
