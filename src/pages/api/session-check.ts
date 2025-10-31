import pool from '../../lib/dbConnect';
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
    const { rows } = await pool.query('SELECT * FROM login WHERE mobile = $1 AND sessionToken = $2', [mobile, sessionToken]);
    if (rows.length === 0) return res.status(200).json({ valid: false });
    res.status(200).json({ valid: true, premium: rows[0].premium });
}
