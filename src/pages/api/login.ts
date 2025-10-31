import pool from '../../lib/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { mobile, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT * FROM login WHERE mobile = $1 AND password = $2', [mobile, password]);
      if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      // Generate session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      // Optionally, update sessionToken in DB if you want to store it
      await pool.query('UPDATE login SET sessionToken = $1 WHERE mobile = $2', [sessionToken, mobile]);
      const user = rows[0];
      res.status(200).json({ success: true, user: { name: user.name, mobile: user.mobile, premium: user.premium, sessionToken } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
