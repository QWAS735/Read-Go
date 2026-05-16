import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PinMapPopup.css";

export default function PinMapPopup({ initialPin, onSave, onClose }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pin, setPin] = useState(initialPin || null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: pin ? [pin.lat, pin.lng] : [20, 0],
      zoom: pin ? 8 : 2,
    });
    instanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;background:#e85d04;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    if (pin) {
      markerRef.current = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
    }

    map.on("click", e => {
      const { lat, lng } = e.latlng;
      setPin({ lat, lng });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      }
    });

    return () => {
      map.remove();
      instanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="pinmap-overlay" onClick={onClose}>
      <div className="pinmap-box" onClick={e => e.stopPropagation()}>
        <button className="pinmap-close" onClick={onClose}>✕</button>
        <p className="pinmap-hint">Click anywhere on the map to place a pin</p>
        <div ref={mapRef} className="pinmap-map" />
        <div className="pinmap-footer">
          {pin && (
            <span className="pinmap-coords">
              {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
            </span>
          )}
          <button
            className="pinmap-save"
            onClick={() => { if (pin) onSave(pin); }}
            disabled={!pin}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
