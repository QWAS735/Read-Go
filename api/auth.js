import { db } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body ?? {};
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const sql = await db();
    const [existing] = await sql`SELECT password FROM users WHERE username = ${username}`;

    if (!existing) {
      await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`;
      return res.json({ success: true, user: { username } });
    }

    if (existing.password !== password) {
      return res.json({ success: false, error: "Incorrect password." });
    }

    return res.json({ success: true, user: { username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
