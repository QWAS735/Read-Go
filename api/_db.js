import { neon } from "@neondatabase/serverless";

let sql;
let ready;

function getSql() {
  if (!sql) sql = neon(process.env.POSTGRES_URL);
  return sql;
}

export async function db() {
  const q = getSql();
  if (!ready) {
    ready = (async () => {
      await q`CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL DEFAULT ''
      )`;
      await q`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT ''`;
      await q`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`.catch(() => {});
      await q`CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT 'Untitled Blog',
        author TEXT NOT NULL,
        thumbnail TEXT NOT NULL DEFAULT '',
        paragraphs JSONB NOT NULL DEFAULT '[]',
        views INT NOT NULL DEFAULT 0,
        likes INT NOT NULL DEFAULT 0,
        comments JSONB NOT NULL DEFAULT '[]',
        tags TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`;
      await q`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'`;
      await q`CREATE TABLE IF NOT EXISTS blog_likes (
        blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
        username TEXT NOT NULL,
        PRIMARY KEY (blog_id, username)
      )`;
      await q`CREATE TABLE IF NOT EXISTS blog_views (
        blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
        username TEXT NOT NULL,
        PRIMARY KEY (blog_id, username)
      )`;
    })();
  }
  await ready;
  return q;
}
