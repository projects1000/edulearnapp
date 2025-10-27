import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { prisma } from "../../../lib/db";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string))
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Find or create user in DB
    const user = await prisma.user.upsert({
      where: { phone: decoded.phone_number },
      update: {},
      create: {
        phone: decoded.phone_number,
        provider: "firebase",
        name: decoded.name || "",
      }
    });
    // You can set a session cookie here or return user info
    res.status(200).json({ success: true, uid: decoded.uid, phone: decoded.phone_number, user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
