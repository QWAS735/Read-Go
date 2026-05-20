import { db } from "../../_db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const sql = await db();

    if (req.method === "GET") {
      const { username } = req.query;
      if (!username) return res.json({ isLiked: false });
      const rows = await sql`SELECT 1 FROM blog_likes WHERE blog_id = ${id} AND username = ${username}`;
      return res.json({ isLiked: rows.length > 0 });
    }

    if (req.method === "POST") {
      const { username } = req.body ?? {};
      if (!username) return res.status(400).json({ error: "Missing username" });

      const [blog] = await sql`SELECT id FROM blogs WHERE id = ${id}`;
      if (!blog) return res.status(404).json({ error: "Not found" });

      const existing = await sql`SELECT 1 FROM blog_likes WHERE blog_id = ${id} AND username = ${username}`;

      if (existing.length > 0) {
        await sql`DELETE FROM blog_likes WHERE blog_id = ${id} AND username = ${username}`;
        const [updated] = await sql`UPDATE blogs SET likes = GREATEST(0, likes - 1) WHERE id = ${id} RETURNING likes`;
        return res.json({ likes: updated.likes, isLiked: false });
      } else {
        await sql`INSERT INTO blog_likes (blog_id, username) VALUES (${id}, ${username})`;
        const [updated] = await sql`UPDATE blogs SET likes = likes + 1 WHERE id = ${id} RETURNING likes`;
        return res.json({ likes: updated.likes, isLiked: true });
      }
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
