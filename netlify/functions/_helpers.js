const fetch = require('isomorphic-fetch');
const { MongoClient } = require('mongodb');

const SITE_URL = process.env.NETLIFY_SITE_URL;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'test';

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');
  const client = new MongoClient(MONGODB_URI, { maxPoolSize: 10, serverApi: { version: '1' } });
  await client.connect();
  const db = client.db(MONGODB_DB);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

async function validateNetlifyToken(token) {
  if (!token) return null;
  if (!SITE_URL) throw new Error('NETLIFY_SITE_URL env var required for token validation');
  const url = `${SITE_URL.replace(/\/$/, '')}/.netlify/identity/user`;
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) {
      return null;
    }
    const user = await resp.json();
    return user;
  } catch (err) {
    console.error('token validation error', err);
    return null;
  }
}

module.exports = { getDb, validateNetlifyToken };
