import { db } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;
  const { comment } = req.body ?? {};

  try {
    const sql = await db();

    const [blog] = await sql`SELECT comments FROM blogs WHERE id = ${id}`;
    if (!blog) return res.status(404).json({ error: "Not found" });

    const updated = [...(blog.comments || []), comment];
    await sql`UPDATE blogs SET comments = ${JSON.stringify(updated)} WHERE id = ${id}`;

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
