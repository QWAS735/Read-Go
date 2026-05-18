import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getBlog, incrementViews, toggleLike, isLiked, deleteBlog } from "../data/storage";
import { useAuth } from "../context/AuthContext";
import TravelMap from "../components/TravelMap";
import CommentSection from "../components/CommentSection";
import "./BlogPage.css";

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const paragraphRefs = useRef({});

  useEffect(() => {
    const b = getBlog(id);
    if (!b) { navigate("/"); return; }
    incrementViews(id);
    setBlog(b);
    setLiked(isLiked(id));
    setLikes(b.likes);
  }, [id]);

  if (!blog) return null;

  // Embed paraId so node clicks map directly to the right paragraph
  const locations = blog.paragraphs
    .filter(p => p.location)
    .map(p => ({ ...p.location, paraId: p.id }));

  const hasMap = locations.length > 0;
  const paragraphImages = blog.paragraphs.filter(p => p.image);

  function handleNodeClick(loc) {
    const el = paragraphRefs.current[loc.paraId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleLike() {
    const result = toggleLike(id);
    setLiked(result.isLiked);
    setLikes(result.likes);
  }

  return (
    <main className="blog-page">
      <div className="blog-page__inner">
        {/* Row 0: Title */}
        <h1 className="blog-page__title">{blog.title}</h1>
        <div className="blog-page__byline">
          <span className="blog-page__author">@{blog.author}</span>
          <span className="blog-page__date">
            {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <button
            className={`blog-page__like-btn ${liked ? "blog-page__like-btn--liked" : ""}`}
            onClick={handleLike}
          >
            {liked ? "♥" : "♡"} {likes.toLocaleString()}
          </button>
        </div>

        {/* Row 1: Content + right column */}
        <div className="blog-page__body">
          <div className="blog-page__content">
            {blog.paragraphs.map(p => (
              <div
                key={p.id}
                className="blog-page__para"
                ref={el => { paragraphRefs.current[p.id] = el; }}
              >
                {p.heading && <h2 className="blog-page__para-heading">{p.heading}</h2>}
                {p.location && (
                  <span className="blog-page__para-location">📍 {p.location.name}</span>
                )}
                {/* Float image right only when there is no map */}
                {p.image && !hasMap && (
                  <img src={p.image} alt={p.heading || ""} className="blog-page__para-img-float" />
                )}
                <p className="blog-page__para-body">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Right column: map + paragraph images stacked below */}
          {hasMap && (
            <div className="blog-page__right-col">
              <div className="blog-page__map-sticky">
                <TravelMap locations={locations} onNodeClick={handleNodeClick} />
              </div>
              {paragraphImages.length > 0 && (
                <div className="blog-page__right-images">
                  {paragraphImages.map(p => (
                    <div key={p.id} className="blog-page__right-image-block">
                      {p.heading && (
                        <span className="blog-page__right-image-label">{p.heading}</span>
                      )}
                      <img src={p.image} alt={p.heading || ""} className="blog-page__right-image" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 2: Comments */}
        <CommentSection blogId={id} initialComments={blog.comments} />

        {/* Admin delete — only visible to the admin account */}
        {user?.username === "Admin" && (
          <div className="blog-page__admin-bar">
            {!confirmDelete ? (
              <button className="blog-page__admin-delete" onClick={() => setConfirmDelete(true)}>
                Delete Blog
              </button>
            ) : (
              <div className="blog-page__admin-confirm">
                <span>Are you sure? This cannot be undone.</span>
                <button className="blog-page__admin-confirm-yes" onClick={() => { deleteBlog(id); navigate("/"); }}>
                  Yes, delete
                </button>
                <button className="blog-page__admin-confirm-no" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
