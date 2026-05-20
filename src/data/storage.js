const SESSION_KEY = 'readgo_session';

export async function getBlogs() {
  const res = await fetch('/api/blogs');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getBlog(id) {
  const res = await fetch(`/api/blogs/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveBlog(blog) {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error('Save failed');
  return res.json();
}

export async function deleteBlog(id) {
  await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
}

export async function incrementViews(blogId, username) {
  if (!username) return;
  await fetch(`/api/blogs/${blogId}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}

export async function toggleLike(blogId, username) {
  const res = await fetch(`/api/blogs/${blogId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

export async function isLiked(blogId, username) {
  if (!username) return false;
  const res = await fetch(`/api/blogs/${blogId}/like?username=${encodeURIComponent(username)}`);
  const data = await res.json();
  return data.isLiked;
}

export async function addComment(blogId, comment) {
  await fetch(`/api/blogs/${blogId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment }),
  });
}

export async function signIn(username, password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
  }
  return data;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

export async function getUserBlogs(username) {
  const res = await fetch(`/api/users/${encodeURIComponent(username)}/blogs`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function generateId() {
  return 'blog-' + Math.random().toString(36).slice(2, 9);
}

export function generateParagraphId() {
  return 'p-' + Math.random().toString(36).slice(2, 9);
}

export function generateCommentId() {
  return 'c-' + Math.random().toString(36).slice(2, 9);
}
