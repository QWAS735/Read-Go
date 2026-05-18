import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.query;
  const { username } = req.body;

  try {
    if (!username) return res.json({ success: false });

    const blog = await kv.get(`blog:${id}`);
    if (!blog) return res.status(404).json({ error: 'Not found' });
    if (blog.author === username) return res.json({ success: false });

    const viewers = (await kv.get(`views:${id}`)) || [];
    if (viewers.includes(username)) return res.json({ success: false });

    await kv.set(`views:${id}`, [...viewers, username]);
    blog.views = (blog.views || 0) + 1;
    await kv.set(`blog:${id}`, blog);

    return res.json({ success: true, views: blog.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
