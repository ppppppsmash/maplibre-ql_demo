import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useMap } from "../hooks/useMap";
import { pointsToGeoJSON } from "../utils";
// https://mui.com/material-ui/material-icons/
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import "./MapView.css";

const ADDED_POINTS_SOURCE_ID = "added-points";
const ADDED_POINTS_LAYER_ID = "added-points-layer";

export function MapView() {
  const containerRef = useRef(null);
  const { map, mapReady } = useMap({ containerRef });

  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
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

  // 削除モードON
  useEffect(() => {
    if (!map || !deleteMode) return;

    const handler = (e) => {
      const feature = e.features?.[0];
      if (feature?.id === undefined) return;
      const index = Number(feature.id);
      if (Number.isNaN(index) || index < 0) return;
      setPoints((prev) => prev.filter((_, i) => i !== index));
    };

    map.on("click", ADDED_POINTS_LAYER_ID, handler);
    return () => map.off("click", ADDED_POINTS_LAYER_ID, handler);
  }, [map, deleteMode]);

  const toggleAddMode = useCallback(() => {
    setAddMode((prev) => !prev);
    setDeleteMode(false);
  }, []);

  const toggleDeleteMode = useCallback(() => {
    setDeleteMode((prev) => !prev);
    setAddMode(false);
  }, []);

  return (
    <div
      className="map-view-wrapper"
    >
      <div ref={containerRef} className="map-view" aria-label="map" />
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button
          className="shimmer-button"
          variant={addMode ? "contained" : "outlined"}
          color={addMode ? "primary" : "secondary"}
          onClick={toggleAddMode}
          sx={{
            ...(!addMode && !deleteMode && {
              backgroundColor: "rgba(255, 255, 255, .4)",
              borderWidth: 2,
            }),
          }}
          startIcon={addMode && <AddCircleIcon />}
        >
          {addMode ? "追加モードON" : "追加モードOFF"}
        </Button>
        <Button
          className="shimmer-button"
          variant={deleteMode ? "contained" : "outlined"}
          color={deleteMode ? "error" : "secondary"}
          onClick={toggleDeleteMode}
          sx={{
            ...(!deleteMode && !addMode && {
              backgroundColor: "rgba(255, 255, 255, .4)",
              borderWidth: 2,
            }),
          }}
          startIcon={deleteMode && <DeleteSweepIcon />}
        >
          {deleteMode ? "削除モードON" : "削除モードOFF"}
        </Button>
      </Box>
    </div>
  );
}
