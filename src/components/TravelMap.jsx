import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TravelMap.css";

// Compute great circle intermediate points between two lat/lng coords
function greatCirclePoints(lat1, lng1, lat2, lng2, numPoints = 80) {
  const toRad = d => (d * Math.PI) / 180;
  const toDeg = r => (r * 180) / Math.PI;

  const φ1 = toRad(lat1), λ1 = toRad(lng1);
  const φ2 = toRad(lat2), λ2 = toRad(lng2);

  const dLng = λ2 - λ1;
  const cosφ1 = Math.cos(φ1), cosφ2 = Math.cos(φ2);
  const sinφ1 = Math.sin(φ1), sinφ2 = Math.sin(φ2);
  const cosdLng = Math.cos(dLng);

  const d = Math.acos(
    Math.max(-1, Math.min(1, sinφ1 * sinφ2 + cosφ1 * cosφ2 * cosdLng))
  );

  if (d < 0.0001) return [[lat1, lng1], [lat2, lng2]];

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * cosφ1 * Math.cos(λ1) + B * cosφ2 * Math.cos(λ2);
    const y = A * cosφ1 * Math.sin(λ1) + B * cosφ2 * Math.sin(λ2);
    const z = A * sinφ1 + B * sinφ2;
    const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λ = Math.atan2(y, x);
    points.push([toDeg(φ), toDeg(λ)]);
  }
  return points;
}

function getBounds(locations) {
  if (!locations.length) return null;
  const lats = locations.map(l => l.lat);
  const lngs = locations.map(l => l.lng);
  const pad = 2;
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad]
  ];
}

export default function TravelMap({ locations, onNodeClick }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    instanceRef.current = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(instanceRef.current);

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map || !locations || locations.length === 0) return;

    // Clear existing layers except tile layer
    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    // Draw great circle arcs between consecutive locations
    for (let i = 0; i < locations.length - 1; i++) {
      const a = locations[i];
      const b = locations[i + 1];
      const points = greatCirclePoints(a.lat, a.lng, b.lat, b.lng);
      L.polyline(points, {
        color: "#e85d04",
        weight: 2.5,
        opacity: 0.75,
        dashArray: "6 4",
      }).addTo(map);
    }

    // Draw markers
    const orangeIcon = L.divIcon({
      className: "",
      html: `<div style="
        width:16px;height:16px;background:#e85d04;border:3px solid #fff;
        border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,0.35);
        cursor:pointer;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], { icon: orangeIcon })
        .addTo(map)
        .bindTooltip(loc.name, { permanent: false, direction: "top" });

      if (onNodeClick) {
        marker.on("click", () => onNodeClick(loc));
      }
    });

    // Fit bounds
    const bounds = getBounds(locations);
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations, onNodeClick]);

  return <div ref={mapRef} className="travel-map" />;
}
