import { db } from "../_db.js";
import { toClient } from "../_toClient.js";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const sql = await db();

    if (req.method === "GET") {
      const [blog] = await sql`SELECT * FROM blogs WHERE id = ${id}`;
      if (!blog) return res.status(404).json({ error: "Not found" });
      return res.json(toClient(blog));
    }

    if (req.method === "DELETE") {
      await sql`DELETE FROM blogs WHERE id = ${id}`;
      return res.json({ success: true });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
