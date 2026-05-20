import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PinMapPopup from "./PinMapPopup";
import "./SearchBar.css";

async function geocode(query) {
  if (!query.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    return data.map(d => ({
      name: d.display_name.split(",").slice(0, 2).join(",").trim(),
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }));
  } catch {
    return [];
  }
}

function stripSpecial(text) {
  return text.replace(/<[^>]*>/g, "").replace(/"[^"]*"/g, "").trim();
}

function extractExtras(text) {
  const tags = [...text.matchAll(/<[^>]+>/g)].map(m => m[0]);
  const titles = [...text.matchAll(/"[^"]+"/g)].map(m => m[0]);
  return [...tags, ...titles].join(" ");
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const q = e.target.value;
    setQuery(q);
    setLocation(null);
    clearTimeout(timerRef.current);
    const locText = stripSpecial(q);
    if (!locText) { setSuggestions([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await geocode(locText);
      setSuggestions(results);
      setLoading(false);
    }, 400);
  }

  function selectSuggestion(s) {
    const extras = extractExtras(query);
    setQuery(s.name + (extras ? " " + extras : ""));
    setLocation(s);
    setSuggestions([]);
  }

  function handlePinSave(pin) {
    const loc = { name: `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`, lat: pin.lat, lng: pin.lng };
    const extras = extractExtras(query);
    setQuery(loc.name + (extras ? " " + extras : ""));
    setLocation(loc);
    setShowPin(false);
  }

  function handleSubmit() {
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query });
    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lng);
    }
    navigate(`/search?${params}`);
    setSuggestions([]);
  }

  function handleClear() {
    setQuery("");
    setLocation(null);
    setSuggestions([]);
  }

  return (
    <div className="search-bar">
      <div className="search-bar__wrap">
        <input
          className="search-bar__input"
          type="text"
          placeholder='Location, "title", <tag>…'
          value={query}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoComplete="off"
        />
        {query && (
          <button className="search-bar__clear" onClick={handleClear} title="Clear">✕</button>
        )}
        {loading && <span className="search-bar__spinner" />}
        {suggestions.length > 0 && (
          <ul className="search-bar__dropdown">
            {suggestions.map((s, i) => (
              <li key={i} className="search-bar__option" onClick={() => selectSuggestion(s)}>
                📍 {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="search-bar__pin-btn"
        onClick={() => setShowPin(true)}
        type="button"
        title="Place pin on map"
      >
        📍
      </button>
      {showPin && (
        <PinMapPopup
          initialPin={location}
          onSave={handlePinSave}
          onClose={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
