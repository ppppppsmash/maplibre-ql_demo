import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useMap } from "../hooks/useMap";
import { pointsToGeoJSON } from "../utils";
// https://mui.com/material-ui/material-icons/
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MenuIcon from "@mui/icons-material/Menu";
import "./MapView.css";

const ADDED_POINTS_SOURCE_ID = "added-points";
const ADDED_POINTS_LAYER_ID = "added-points-layer";

export function MapView() {
  const containerRef = useRef(null);
  const { map, mapReady } = useMap({ containerRef });

  const [addMode, setAddMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [points, setPoints] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

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

  const openMenu = useCallback((e) => setMenuAnchor(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  const handleAddMode = useCallback(() => {
    setAddMode(true);
    setDeleteMode(false);
    closeMenu();
  }, [closeMenu]);

  const handleDeleteMode = useCallback(() => {
    setDeleteMode(true);
    setAddMode(false);
    closeMenu();
  }, [closeMenu]);

  const handleClearMode = useCallback(() => {
    setAddMode(false);
    setDeleteMode(false);
    closeMenu();
  }, [closeMenu]);

  const mapCursor = addMode ? "crosshair" : deleteMode ? "pointer" : undefined;

  return (
    <div
      className="map-view-wrapper"
      style={{ cursor: mapCursor }}
    >
      <div ref={containerRef} className="map-view" aria-label="map" />
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <IconButton
          aria-label="popover menu"
          aria-controls={menuOpen ? "map-actions-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={openMenu}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: 2,
            },
            // https://mui.com/material-ui/customization/palette/
            ...(addMode && { color: "primary.main" }),
            ...(deleteMode && { color: "error.main" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        {/* https://mui.com/material-ui/react-menu/ */}
        <Menu
          id="map-actions-menu"
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 200 } } }}
        >
          <MenuItem onClick={handleAddMode} selected={addMode}>
            <ListItemIcon>
              <AddCircleIcon color={addMode ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="ポイントを追加" />
          </MenuItem>
          <MenuItem onClick={handleDeleteMode} selected={deleteMode}>
            <ListItemIcon>
              <DeleteSweepIcon color={deleteMode ? "error" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="ポイントを削除" />
          </MenuItem>
          {(addMode || deleteMode) && (
            <MenuItem onClick={handleClearMode}>
              <ListItemText primary="モードを解除" />
            </MenuItem>
          )}
        </Menu>
      </Box>
    </div>
  );
}
