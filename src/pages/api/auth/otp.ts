import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store OTP in-memory or DB for verification (demo: skip)
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: fromNumber,
      to: phone,
    });
    res.status(200).json({ success: true, otp }); // Return OTP for demo; remove in prod
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}
