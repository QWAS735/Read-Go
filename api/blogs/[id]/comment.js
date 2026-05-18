import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.query;
  const { comment } = req.body;

  try {
    const blog = await kv.get(`blog:${id}`);
    if (!blog) return res.status(404).json({ error: 'Not found' });

    blog.comments = [...(blog.comments || []), comment];
    await kv.set(`blog:${id}`, blog);

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
