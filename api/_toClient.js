export function toClient(r) {
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
    status: r.status || "published",
    rejectionReason: r.rejection_reason || "",
    createdAt: r.created_at,
  };
}
