import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBlogs } from "../data/storage";
import { SmallBlogCard } from "../components/BlogCard";
import "./BlogListPage.css";

const CONFIGS = {
  "most-viewed": { label: "Most Viewed", sort: (a, b) => b.views - a.views },
  "most-liked":  { label: "Most Liked",  sort: (a, b) => b.likes - a.likes },
};

export default function BlogListPage() {
  const { type } = useParams();
  const [blogs, setBlogs] = useState([]);
  const config = CONFIGS[type] || { label: type, sort: () => 0 };

  useEffect(() => {
    getBlogs().then(all => setBlogs([...all].sort(config.sort)));
  }, [type]);

  return (
    <main className="list-page">
      <h1 className="list-page__title">{config.label}</h1>
      <div className="list-page__grid">
        {blogs.map(b => <SmallBlogCard key={b.id} blog={b} />)}
      </div>
    </main>
  );
}
