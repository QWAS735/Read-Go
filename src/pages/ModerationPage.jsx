import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPendingBlogs, updateBlogStatus } from "../data/storage";
import "./ModerationPage.css";

const MODERATORS = ["Admin", "Moderator"];

export default function ModerationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!user || !MODERATORS.includes(user.username)) {
      navigate("/");
      return;
    }
    getPendingBlogs(user.username).then(setBlogs);
  }, [user]);

  async function handleApprove(id) {
    await updateBlogStatus(id, user.username, "published");
    setBlogs(prev => prev.filter(b => b.id !== id));
  }

  async function handleReject(id) {
    await updateBlogStatus(id, user.username, "rejected", reason);
    setBlogs(prev => prev.filter(b => b.id !== id));
    setRejectingId(null);
    setReason("");
  }

  if (!user || !MODERATORS.includes(user.username)) return null;

  return (
    <main className="mod-page">
      <h1 className="mod-page__title">Moderation Queue</h1>
      {blogs.length === 0 ? (
        <p className="mod-page__empty">No blogs pending review.</p>
      ) : (
        <div className="mod-page__list">
          {blogs.map(blog => (
            <div key={blog.id} className="mod-card">
              <div className="mod-card__meta">
                <span className="mod-card__author">@{blog.author}</span>
                <span className="mod-card__date">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h2 className="mod-card__title">{blog.title || "Untitled Blog"}</h2>
              {blog.paragraphs?.[0]?.body && (
                <p className="mod-card__preview">
                  {blog.paragraphs[0].body.length > 180
                    ? blog.paragraphs[0].body.slice(0, 177) + "…"
                    : blog.paragraphs[0].body}
                </p>
              )}
              <div className="mod-card__actions">
                <button className="mod-card__read-btn" onClick={() => navigate(`/blog/${blog.id}`)}>
                  Read
                </button>
                <button className="mod-card__approve-btn" onClick={() => handleApprove(blog.id)}>
                  Approve
                </button>
                {rejectingId === blog.id ? (
                  <div className="mod-card__reject-form">
                    <input
                      className="mod-card__reason-input"
                      type="text"
                      placeholder="Reason (optional)"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      autoFocus
                    />
                    <button className="mod-card__reject-confirm-btn" onClick={() => handleReject(blog.id)}>
                      Confirm Reject
                    </button>
                    <button className="mod-card__reject-cancel-btn" onClick={() => { setRejectingId(null); setReason(""); }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="mod-card__reject-btn" onClick={() => { setRejectingId(blog.id); setReason(""); }}>
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
