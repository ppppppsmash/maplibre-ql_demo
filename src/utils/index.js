// https://geojson.ioからフォーマットの参考
export const pointsToGeoJSON = (points) => {
  return {
    type: "FeatureCollection",
    features: points.map(([lng, lat], i) => ({
      type: "Feature",
      id: i,
      // GeoJSONのcoordinates: [経度, 緯度]
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: {},
    })),
  };
};
