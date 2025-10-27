import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const existing = await User.findOne({ mobile });
    if (existing) return res.status(409).json({ error: 'Mobile already registered' });
    const user = await User.create({ name, mobile, password });
    res.status(201).json({ success: true, user: { name: user.name, mobile: user.mobile } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
