import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBlogs } from "../data/storage";
import { SmallBlogCard } from "../components/BlogCard";
import { tagColor } from "../data/tags";
import "./SearchPage.css";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function blogMinDist(blog, lat, lng) {
  const locs = (blog.paragraphs || []).filter(p => p.location);
  if (!locs.length) return Infinity;
  return Math.min(...locs.map(p => haversine(p.location.lat, p.location.lng, lat, lng)));
}

function fmtDist(km) {
  if (!isFinite(km)) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));
  const hasLocation = isFinite(lat) && isFinite(lng);

  const filterTags = [...q.matchAll(/<([^>]+)>/g)].map(m => m[1].trim().toLowerCase());
  const filterTitles = [...q.matchAll(/"([^"]+)"/g)].map(m => m[1].trim().toLowerCase());
  const locationLabel = q.replace(/<[^>]*>/g, "").replace(/"[^"]*"/g, "").trim();

  useEffect(() => {
    setLoading(true);
    const fTags = [...q.matchAll(/<([^>]+)>/g)].map(m => m[1].trim().toLowerCase());
    const fTitles = [...q.matchAll(/"([^"]+)"/g)].map(m => m[1].trim().toLowerCase());

    getBlogs().then(all => {
      let results = all;

      if (fTags.length > 0) {
        results = results.filter(b =>
          fTags.every(t => (b.tags || []).map(x => x.toLowerCase()).includes(t))
        );
      }

      if (fTitles.length > 0) {
        results = results.filter(b =>
          fTitles.some(t => b.title.toLowerCase().includes(t))
        );
      }

      if (hasLocation) {
        results = results
          .map(b => ({ ...b, _dist: blogMinDist(b, lat, lng) }))
          .sort((a, b) => a._dist - b._dist);
      }

      setBlogs(results);
      setLoading(false);
    });
  }, [q, lat, lng]);

  return (
    <main className="search-page">
      <div className="search-page__inner">
        <div className="search-page__header">
          <button className="search-page__back" onClick={() => navigate("/")}>← Home</button>
          <h2 className="search-page__heading">
            {loading ? "Searching…" : `${blogs.length} result${blogs.length !== 1 ? "s" : ""}`}
          </h2>
          <div className="search-page__chips">
            {hasLocation && locationLabel && (
              <span className="search-page__chip search-page__chip--loc">📍 {locationLabel}</span>
            )}
            {filterTags.map(t => {
              const { bg, fg } = tagColor(t);
              return (
                <span key={t} className="search-page__chip" style={{ background: bg, color: fg }}>
                  #{t}
                </span>
              );
            })}
            {filterTitles.map(t => (
              <span key={t} className="search-page__chip search-page__chip--title">"{t}"</span>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="search-page__status">Loading…</div>
        ) : blogs.length === 0 ? (
          <div className="search-page__status">No blogs matched your search.</div>
        ) : (
          <div className="search-page__grid">
            {blogs.map(b => (
              <div key={b.id} className="search-page__card-wrap">
                <SmallBlogCard blog={b} />
                {hasLocation && b._dist != null && isFinite(b._dist) && (
                  <span className="search-page__dist">📍 {fmtDist(b._dist)} away</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
