import { useRef } from "react";
import { useMap } from "../hooks/useMap";
import "./MapView.css";

export function MapView() {
  const containerRef = useRef(null);
  useMap({ containerRef });

  return <div ref={containerRef} className="map-view" aria-label="地図" />;
}
