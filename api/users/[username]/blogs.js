import { db } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;

  try {
    const sql = await db();
    const rows = await sql`
      SELECT * FROM blogs WHERE author = ${username} ORDER BY created_at DESC
    `;
    return res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      author: r.author,
      thumbnail: r.thumbnail,
      paragraphs: r.paragraphs,
      views: r.views,
      likes: r.likes,
      comments: r.comments,
      createdAt: r.created_at,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
