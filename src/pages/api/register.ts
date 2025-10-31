import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    // Check if user exists
    const { rows: existing } = await pool.query('SELECT * FROM login WHERE mobile = $1', [mobile]);
    if (existing.length > 0) return res.status(409).json({ error: 'Mobile already registered' });
    // Insert new user
    await pool.query(
      'INSERT INTO login (name, mobile, password) VALUES ($1, $2, $3)',
      [name, mobile, password]
    );
    res.status(201).json({ success: true, user: { name, mobile } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
