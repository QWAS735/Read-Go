import { db } from "./_db.js";

function toClient(r) {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    thumbnail: r.thumbnail,
    paragraphs: r.paragraphs,
    views: r.views,
    likes: r.likes,
    comments: r.comments,
    tags: r.tags || [],
    createdAt: r.created_at,
  };
}

export default async function handler(req, res) {
  try {
    const sql = await db();

    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
      return res.json(rows.map(toClient));
    }

    if (req.method === "POST") {
      const { id, title, author, thumbnail, paragraphs, tags } = req.body ?? {};
      if (!id || !author) return res.status(400).json({ error: "Missing fields" });

      await sql`
        INSERT INTO blogs (id, title, author, thumbnail, paragraphs, tags)
        VALUES (
          ${id},
          ${title ?? "Untitled Blog"},
          ${author},
          ${thumbnail ?? ""},
          ${JSON.stringify(paragraphs ?? [])},
          ${tags ?? []}
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
