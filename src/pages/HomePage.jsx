import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../data/storage";
import { LargeBlogCard, SmallBlogCard } from "../components/BlogCard";
import "./HomePage.css";

function HorizontalRow({ title, blogs, linkTo }) {
  const navigate = useNavigate();
  return (
    <section className="home-row">
      <div className="home-row__header">
        <button className="home-row__title-btn" onClick={() => navigate(linkTo)}>
          {title} <span className="home-row__arrow">›</span>
        </button>
      </div>
      <div className="home-row__scroll">
        {blogs.map(b => <LargeBlogCard key={b.id} blog={b} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs().then(setBlogs);
  }, []);

  const mostViewed = [...blogs].sort((a, b) => b.views - a.views).slice(0, 10);
  const mostLiked = [...blogs].sort((a, b) => b.likes - a.likes).slice(0, 10);
  const recent = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main className="home">
      <HorizontalRow title="Most Viewed ›" blogs={mostViewed} linkTo="/list/most-viewed" />
      <HorizontalRow title="Most Liked ›" blogs={mostLiked} linkTo="/list/most-liked" />
      <section className="home-recent">
        <h2 className="home-recent__title">Recently Published</h2>
        <div className="home-recent__grid">
          {recent.map(b => <SmallBlogCard key={b.id} blog={b} />)}
        </div>
      </section>
    </main>
  );
}
