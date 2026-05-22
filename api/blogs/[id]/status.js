import { db } from "../../_db.js";
import { MODERATORS } from "../../_roles.js";

const VALID = ["draft", "pending", "published", "rejected"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;
  const { username, status, reason } = req.body ?? {};

  if (!username || !status || !VALID.includes(status)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const sql = await db();
    const [blog] = await sql`SELECT author FROM blogs WHERE id = ${id}`;
    if (!blog) return res.status(404).json({ error: "Not found" });

    if (status === "pending" || status === "draft") {
      if (blog.author !== username) return res.status(403).json({ error: "Forbidden" });
    }

    if (status === "published" || status === "rejected") {
      if (!MODERATORS.includes(username)) return res.status(403).json({ error: "Forbidden" });
    }

    await sql`
      UPDATE blogs
      SET status = ${status}, rejection_reason = ${reason || ""}
      WHERE id = ${id}
    `;

    return res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
