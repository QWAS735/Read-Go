import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { username } = req.query;

  try {
    const ids = (await kv.get('blogs:ids')) || [];
    const all = await Promise.all(ids.map(id => kv.get(`blog:${id}`)));
    const userBlogs = all.filter(b => b && b.author === username);
    return res.json(userBlogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
