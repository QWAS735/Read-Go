import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const ids = (await kv.get('blogs:ids')) || [];
      const blogs = await Promise.all(ids.map(id => kv.get(`blog:${id}`)));
      return res.json(blogs.filter(Boolean));
    }

    if (req.method === 'POST') {
      const blog = req.body;
      if (!blog?.id) return res.status(400).json({ error: 'Missing id' });
      const existing = await kv.get(`blog:${blog.id}`);
      await kv.set(`blog:${blog.id}`, blog);
      if (!existing) {
        const ids = (await kv.get('blogs:ids')) || [];
        await kv.set('blogs:ids', [blog.id, ...ids]);
      }
      return res.json(blog);
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
