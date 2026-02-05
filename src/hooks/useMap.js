import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { OSM_BASE_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from "../config/mapConfig";

export function useMap(options = {}) {
  const {
    containerRef,
    style = OSM_BASE_STYLE,
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
  } = options;

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style,
      center,
      zoom,
    });

    mapRef.current = map;

    map.on("load", () => setMapReady(true));

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { map: mapRef.current, mapReady };
}
