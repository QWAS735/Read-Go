import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const blog = await kv.get(`blog:${id}`);
      if (!blog) return res.status(404).json({ error: 'Not found' });
      return res.json(blog);
    }

    if (req.method === 'DELETE') {
      await kv.del(`blog:${id}`);
      const ids = (await kv.get('blogs:ids')) || [];
      await kv.set('blogs:ids', ids.filter(i => i !== id));
      return res.json({ success: true });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
