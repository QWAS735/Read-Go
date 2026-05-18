const BLOGS_KEY = "readgo_blogs";
const USERS_KEY = "readgo_users";
const SESSION_KEY = "readgo_session";

function initStorage() {
  if (!localStorage.getItem(BLOGS_KEY)) {
    localStorage.setItem(BLOGS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

export function getBlogs() {
  initStorage();
  return JSON.parse(localStorage.getItem(BLOGS_KEY));
}

export function getBlog(id) {
  return getBlogs().find(b => b.id === id) || null;
}

export function saveBlog(blog) {
  const blogs = getBlogs();
  const idx = blogs.findIndex(b => b.id === blog.id);
  if (idx >= 0) {
    blogs[idx] = blog;
  } else {
    blogs.push(blog);
  }
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return blog;
}

export function deleteBlog(id) {
  const blogs = getBlogs().filter(b => b.id !== id);
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
}

const VIEWS_KEY = "readgo_views";

export function incrementViews(blogId) {
  const session = getSession();
  const username = session?.username;
  if (!username) return;
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) return;
  if (blog.author === username) return;
  const views = JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}");
  const viewers = views[blogId] || [];
  if (viewers.includes(username)) return;
  views[blogId] = [...viewers, username];
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  blog.views = (blog.views || 0) + 1;
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
}

export function toggleLike(id) {
  const likedKey = "readgo_liked";
  const liked = JSON.parse(localStorage.getItem(likedKey) || "[]");
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === id);
  if (!blog) return { likes: 0, isLiked: false };

  const isLiked = liked.includes(id);
  if (isLiked) {
    blog.likes = Math.max(0, (blog.likes || 0) - 1);
    localStorage.setItem(likedKey, JSON.stringify(liked.filter(l => l !== id)));
  } else {
    blog.likes = (blog.likes || 0) + 1;
    localStorage.setItem(likedKey, JSON.stringify([...liked, id]));
  }
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return { likes: blog.likes, isLiked: !isLiked };
}

export function isLiked(id) {
  const liked = JSON.parse(localStorage.getItem("readgo_liked") || "[]");
  return liked.includes(id);
}

export function addComment(blogId, comment) {
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === blogId);
  if (blog) {
    blog.comments = [...(blog.comments || []), comment];
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  }
}

export function getUsers() {
  initStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY));
}

export function signIn(username, password) {
  const users = getUsers();
  const existing = users.find(u => u.username === username);
  if (!existing) {
    const newUser = { username, password, blogIds: [] };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
    return { success: true, user: newUser };
  }
  if (existing.password !== password) {
    return { success: false, error: "Incorrect password." };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
  return { success: true, user: existing };
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

export function getUserBlogs(username) {
  const blogs = getBlogs();
  return blogs.filter(b => b.author === username);
}

export function addBlogToUser(username, blogId) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user && !user.blogIds.includes(blogId)) {
    user.blogIds.push(blogId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function generateId() {
  return "blog-" + Math.random().toString(36).slice(2, 9);
}

export function generateParagraphId() {
  return "p-" + Math.random().toString(36).slice(2, 9);
}

export function generateCommentId() {
  return "c-" + Math.random().toString(36).slice(2, 9);
}
