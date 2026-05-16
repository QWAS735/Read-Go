import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getBlog, incrementViews, toggleLike, isLiked } from "../data/storage";
import TravelMap from "../components/TravelMap";
import CommentSection from "../components/CommentSection";
import "./BlogPage.css";

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
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

  const locations = blog.paragraphs
    .filter(p => p.location)
    .map(p => p.location);

  function handleNodeClick(loc) {
    const para = blog.paragraphs.find(p => p.location && p.location.name === loc.name);
    if (para && paragraphRefs.current[para.id]) {
      paragraphRefs.current[para.id].scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

        {/* Row 1: Content + Map */}
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
                <p className="blog-page__para-body">{p.body}</p>
              </div>
            ))}
          </div>
          {locations.length > 0 && (
            <div className="blog-page__map-wrap">
              <TravelMap locations={locations} onNodeClick={handleNodeClick} />
            </div>
          )}
        </div>

        {/* Row 2: Comments */}
        <CommentSection blogId={id} initialComments={blog.comments} />
      </div>
    </main>
  );
}
