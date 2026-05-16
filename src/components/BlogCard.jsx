import { useNavigate } from "react-router-dom";
import "./BlogCard.css";

function excerpt(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return "";
  const text = paragraphs[0].body || "";
  return text.length > 140 ? text.slice(0, 137) + "…" : text;
}

export function LargeBlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <div className="blog-card blog-card--large" onClick={() => navigate(`/blog/${blog.id}`)}>
      <div className="blog-card__thumb-wrap">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="blog-card__thumb"
          loading="lazy"
        />
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">{blog.title}</h3>
        <p className="blog-card__excerpt">{excerpt(blog.paragraphs)}</p>
        <div className="blog-card__meta">
          <span className="blog-card__author">@{blog.author}</span>
          <span className="blog-card__stats">
            👁 {blog.views.toLocaleString()} &nbsp; ♥ {blog.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SmallBlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <div className="blog-card blog-card--small" onClick={() => navigate(`/blog/${blog.id}`)}>
      <div className="blog-card__thumb-wrap blog-card__thumb-wrap--small">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="blog-card__thumb"
          loading="lazy"
        />
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title blog-card__title--small">{blog.title}</h3>
        <p className="blog-card__excerpt blog-card__excerpt--small">{excerpt(blog.paragraphs)}</p>
        <div className="blog-card__meta">
          <span className="blog-card__author">@{blog.author}</span>
          <span className="blog-card__stats">
            👁 {blog.views.toLocaleString()} &nbsp; ♥ {blog.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
