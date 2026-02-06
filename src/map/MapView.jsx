import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useMap } from "../hooks/useMap";
import { pointsToGeoJSON } from "../utils";
// https://mui.com/material-ui/material-icons/
import AddCircleIcon from "@mui/icons-material/AddCircle";
import "./MapView.css";

const ADDED_POINTS_SOURCE_ID = "added-points";
const ADDED_POINTS_LAYER_ID = "added-points-layer";

export function MapView() {
  const containerRef = useRef(null);
  const { map, mapReady } = useMap({ containerRef });

  const [addMode, setAddMode] = useState(false);
  const [points, setPoints] = useState([]);

  // 追加ポイント用
  useEffect(() => {
    if (!map || !mapReady) return;

    if (map.getSource(ADDED_POINTS_SOURCE_ID)) return;

    // 参考url: https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/
    // https://maplibre.org/maplibre-gl-js/docs/examples/add-a-new-layer-below-labels/
    map.addSource(ADDED_POINTS_SOURCE_ID, {
      type: "geojson",
      data: pointsToGeoJSON([]),
    });

    map.addLayer({
      id: ADDED_POINTS_LAYER_ID,
      type: "circle",
      source: ADDED_POINTS_SOURCE_ID,
      paint: {
        "circle-radius": 8,
        "circle-color": "#1976d2",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  }, [map, mapReady]);

  useEffect(() => {
    if (!map?.getSource(ADDED_POINTS_SOURCE_ID)) return;
    map.getSource(ADDED_POINTS_SOURCE_ID).setData(pointsToGeoJSON(points));
  }, [map, points]);

  // 追加モードON
  useEffect(() => {
    if (!map || !addMode) return;

    const handler = (e) => {
      const { lng, lat } = e.lngLat;
      setPoints((prev) => [...prev, [lng, lat]]);
    };

    map.on("click", handler);
    return () => map.off("click", handler);
  }, [map, addMode]);

  const toggleAddMode = useCallback(() => setAddMode((prev) => !prev), []);

  return (
    <div
      className="map-view-wrapper"
      style={{ cursor: addMode ? "crosshair" : undefined }}
    >
      <div ref={containerRef} className="map-view" aria-label="map" />
      <Button
        className="shimmer-button"
        variant={addMode ? "contained" : "outlined"}
        color={addMode ? "primary" : "secondary"}
        onClick={toggleAddMode}
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 1000,
          // https://mui.com/system/getting-started/the-sx-prop/
          // sxでspread syntacで
          ...(!addMode && {
            backgroundColor: "rgba(255, 255, 255, .4)",
            borderWidth: 2,
          }),
        }}
        startIcon={addMode && <AddCircleIcon />}
      >
        {addMode ? "追加モードON" : "追加モードOFF"}
      </Button>
    </div>
  );
}
