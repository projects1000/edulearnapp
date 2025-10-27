import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { mobile, password } = req.body;
  try {
    const user = await User.findOne({ mobile, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json({ success: true, user: { name: user.name, mobile: user.mobile } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
