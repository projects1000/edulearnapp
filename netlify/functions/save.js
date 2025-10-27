const { getDb, validateNetlifyToken } = require('./_helpers');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Missing Authorization header' }) };
  }
  const token = authHeader.split(' ')[1];

  let user;
  try {
    user = await validateNetlifyToken(token);
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Token validation failed' }) };
  }

  if (!user || !user.email) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, message } = payload || {};
  if (!name) return { statusCode: 400, body: JSON.stringify({ error: 'Missing name' }) };

  try {
    const { db } = await getDb();
    const doc = {
      name,
      message: message || null,
      userEmail: user.email,
      userId: user.id || user.user_id || null,
      createdAt: new Date()
    };
    const res = await db.collection('contacts').insertOne(doc);
    return {
      statusCode: 201,
      body: JSON.stringify({ id: res.insertedId, inserted: true })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'DB error' }) };
  }
};
