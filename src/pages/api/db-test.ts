import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ success: true, time: result.rows[0].now });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: errorMsg });
  }
}
