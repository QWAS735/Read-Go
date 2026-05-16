import { useState, useRef, useEffect } from "react";
import PinMapPopup from "./PinMapPopup";
import "./LocationInput.css";

async function geocode(query) {
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

export default function LocationInput({ value, onChange }) {
  const [query, setQuery] = useState(value ? value.name : "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  function handleChange(e) {
    const q = e.target.value;
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setSuggestions([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await geocode(q);
      setSuggestions(results);
      setLoading(false);
    }, 400);
  }

  function selectSuggestion(s) {
    setQuery(s.name);
    setSuggestions([]);
    onChange(s);
  }

  function handlePinSave(pin) {
    const loc = { name: `${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`, lat: pin.lat, lng: pin.lng };
    setQuery(loc.name);
    onChange(loc);
    setShowPin(false);
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    onChange(null);
  }

  return (
    <div className="location-input">
      <div className="location-input__row">
        <div className="location-input__search-wrap">
          <input
            className="location-input__field"
            type="text"
            placeholder="Location (e.g. Paris, France)"
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />
          {query && (
            <button className="location-input__clear" onClick={handleClear} title="Clear">✕</button>
          )}
          {loading && <span className="location-input__spinner">⏳</span>}
          {suggestions.length > 0 && (
            <ul className="location-input__dropdown">
              {suggestions.map((s, i) => (
                <li key={i} className="location-input__option" onClick={() => selectSuggestion(s)}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="location-input__pin-btn"
          title="Place pin on map"
          onClick={() => setShowPin(true)}
          type="button"
        >
          📍
        </button>
      </div>
      {showPin && (
        <PinMapPopup
          initialPin={value}
          onSave={handlePinSave}
          onClose={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
