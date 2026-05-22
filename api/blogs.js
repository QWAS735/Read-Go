import { db } from "./_db.js";
import { toClient } from "./_toClient.js";
import { MODERATORS } from "./_roles.js";

export default async function handler(req, res) {
  try {
    const sql = await db();

    if (req.method === "GET") {
      const { status, username } = req.query;

      if (status === "pending") {
        if (!MODERATORS.includes(username)) return res.status(403).json({ error: "Forbidden" });
        const rows = await sql`SELECT * FROM blogs WHERE status = 'pending' ORDER BY created_at ASC`;
        return res.json(rows.map(toClient));
      }

      const rows = await sql`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`;
      return res.json(rows.map(toClient));
    }

    if (req.method === "POST") {
      const { id, title, author, thumbnail, paragraphs, tags } = req.body ?? {};
      if (!id || !author) return res.status(400).json({ error: "Missing fields" });

      await sql`
        INSERT INTO blogs (id, title, author, thumbnail, paragraphs, tags, status)
        VALUES (
          ${id},
          ${title ?? "Untitled Blog"},
          ${author},
          ${thumbnail ?? ""},
          ${JSON.stringify(paragraphs ?? [])},
          ${tags ?? []},
          'draft'
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          thumbnail = EXCLUDED.thumbnail,
          paragraphs = EXCLUDED.paragraphs,
          tags = EXCLUDED.tags
      `;
      const [blog] = await sql`SELECT * FROM blogs WHERE id = ${id}`;
      return res.json(toClient(blog));
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
