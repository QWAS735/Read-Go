import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addComment, generateCommentId } from "../data/storage";
import "./CommentSection.css";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommentSection({ blogId, initialComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      setError("Please sign in to comment.");
      return;
    }
    const comment = {
      id: generateCommentId(),
      author: user.username,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    addComment(blogId, comment);
    setComments(prev => [...prev, comment]);
    setText("");
    setError("");
  }

  return (
    <section className="comments">
      <h2 className="comments__heading">Comments ({comments.length})</h2>
      <div className="comments__list">
        {comments.length === 0 && (
          <p className="comments__empty">No comments yet. Be the first!</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="comment">
            <span className="comment__author">@{c.author}</span>
            <span className="comment__time">{timeAgo(c.createdAt)}</span>
            <p className="comment__text">{c.text}</p>
          </div>
        ))}
      </div>
      <form className="comments__form" onSubmit={handleSubmit}>
        <textarea
          className="comments__input"
          placeholder={user ? "Write a comment…" : "Sign in to comment"}
          value={text}
          onChange={e => { setText(e.target.value); setError(""); }}
          disabled={!user}
          rows={3}
        />
        {error && <p className="comments__error">{error}</p>}
        <button className="comments__submit" type="submit" disabled={!user}>
          Post Comment
        </button>
      </form>
    </section>
  );
}
