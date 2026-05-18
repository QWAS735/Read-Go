import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { username } = req.query;
      if (!username) return res.json({ isLiked: false });
      const likes = (await kv.get(`likes:${username}`)) || [];
      return res.json({ isLiked: likes.includes(id) });
    }

    if (req.method === 'POST') {
      const { username } = req.body;
      if (!username) return res.status(400).json({ error: 'Missing username' });

      const blog = await kv.get(`blog:${id}`);
      if (!blog) return res.status(404).json({ error: 'Not found' });

      const likes = (await kv.get(`likes:${username}`)) || [];
      const alreadyLiked = likes.includes(id);

      if (alreadyLiked) {
        await kv.set(`likes:${username}`, likes.filter(l => l !== id));
        blog.likes = Math.max(0, (blog.likes || 0) - 1);
      } else {
        await kv.set(`likes:${username}`, [...likes, id]);
        blog.likes = (blog.likes || 0) + 1;
      }

      await kv.set(`blog:${id}`, blog);
      return res.json({ likes: blog.likes, isLiked: !alreadyLiked });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
