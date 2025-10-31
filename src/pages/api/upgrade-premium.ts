import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ error: 'Missing mobile' });
  }
  await dbConnect();
  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.premium = true;
  await user.save();
  return res.status(200).json({ success: true });
}
