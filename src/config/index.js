// OSMベースタイル: OpenStreetMapのタイルサーバーを背景にしたラスタベース?かな
// 初期表示の中心 [経度, 緯度]、新宿
export const DEFAULT_CENTER = [139.6914640862857, 35.68674112084986];

// 初期ズーム
export const DEFAULT_ZOOM = 10;

// https://maplibre.org/maplibre-gl-js/docs/examples/add-a-raster-tile-source/
export const OSM_BASE_STYLE = {
  version: 8,
  sources: {
    "osm-raster": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-raster-layer",
      type: "raster",
      source: "osm-raster",
      attribution: "© OpenStreetMap contributors",
    },
  ],
  id: "blank",
};
