import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserBlogs, generateId, saveBlog } from "../data/storage";
import "./CreationMainPage.css";

export default function CreationMainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    if (user) {
      getUserBlogs(user.username).then(setMyBlogs);
    }
  }, [user]);

  if (!user) {
    return (
      <main className="creation-main">
        <p className="creation-main__no-auth">Please sign in to create blogs.</p>
      </main>
    );
  }

  async function handleNewBlog() {
    const id = generateId();
    const blog = {
      id,
      title: "Untitled Blog",
      author: user.username,
      thumbnail: "",
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      paragraphs: [],
      comments: [],
    };
    await saveBlog(blog);
    navigate(`/edit/${id}`);
  }

  return (
    <main className="creation-main">
      <h1 className="creation-main__title">Blog Creation Tool</h1>
      <div className="creation-main__grid">
        {myBlogs.map(blog => (
          <div
            key={blog.id}
            className="creation-card"
            onClick={() => navigate(`/edit/${blog.id}`)}
          >
            {blog.thumbnail
              ? <img src={blog.thumbnail} alt={blog.title} className="creation-card__thumb" />
              : <div className="creation-card__no-thumb">No thumbnail</div>
            }
            <div className="creation-card__body">
              <h3 className="creation-card__title">{blog.title}</h3>
              <p className="creation-card__meta">
                {blog.paragraphs.length} paragraph{blog.paragraphs.length !== 1 ? "s" : ""}
                &nbsp;·&nbsp;
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <span className={`creation-card__status creation-card__status--${blog.status || "draft"}`}>
                {blog.status === "pending" ? "Pending Review"
                  : blog.status === "published" ? "Published"
                  : blog.status === "rejected" ? "Rejected"
                  : "Draft"}
              </span>
            </div>
          </div>
        ))}
        <button className="creation-card creation-card--new" onClick={handleNewBlog}>
          <span className="creation-card__plus">+</span>
          <span className="creation-card__new-label">New Blog</span>
        </button>
      </div>
    </main>
  );
}
