import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existing = await kv.get(`user:${username}`);

    if (!existing) {
      await kv.set(`user:${username}`, { username, password });
      return res.json({ success: true, user: { username } });
    }

    if (existing.password !== password) {
      return res.json({ success: false, error: 'Incorrect password.' });
    }

    return res.json({ success: true, user: { username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
