import { db } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;
  const { username } = req.body ?? {};

  try {
    if (!username) return res.json({ success: false });

    const sql = await db();

    const [blog] = await sql`SELECT author FROM blogs WHERE id = ${id}`;
    if (!blog) return res.status(404).json({ error: "Not found" });
    if (blog.author === username) return res.json({ success: false });

    const existing = await sql`SELECT 1 FROM blog_views WHERE blog_id = ${id} AND username = ${username}`;
    if (existing.length > 0) return res.json({ success: false });

    await sql`INSERT INTO blog_views (blog_id, username) VALUES (${id}, ${username})`;
    const [updated] = await sql`UPDATE blogs SET views = views + 1 WHERE id = ${id} RETURNING views`;

    return res.json({ success: true, views: updated.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
