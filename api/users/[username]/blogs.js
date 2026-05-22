import { db } from "../../_db.js";
import { toClient } from "../../_toClient.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;

  try {
    const sql = await db();
    const rows = await sql`SELECT * FROM blogs WHERE author = ${username} ORDER BY created_at DESC`;
    return res.json(rows.map(toClient));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
